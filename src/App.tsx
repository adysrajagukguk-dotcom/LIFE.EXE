import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameScene } from './game3d/GameScene';
import { InteractiveZone } from './game3d/CityBuilder';
import { LOCATIONS, NPCS } from './data/cityData';
import { GAME_EVENTS } from './data/eventsData';
import {
  PlayerStats,
  LocationData,
  NPCData,
  Activity,
  GameEvent,
  GameEventChoice,
  DecisionRecord,
  FinalProfile,
  DaySummary,
  Archetype,
} from './types/game';
import { HUD } from './components/HUD';
import { InteractionModal } from './components/InteractionModal';
import { NPCModal } from './components/NPCModal';
import { EventModal } from './components/EventModal';
import { NotificationToast, ToastItem } from './components/NotificationToast';
import { SleepTransitionModal } from './components/SleepTransitionModal';
import { EndGameProfileModal } from './components/EndGameProfileModal';
import { OnboardingModal } from './components/OnboardingModal';
import { CityMapModal } from './components/CityMapModal';
import { HelpModal } from './components/HelpModal';
import { MobileControls } from './components/MobileControls';
import { soundManager } from './audio/soundManager';

const INITIAL_STATS: PlayerStats = {
  knowledge: 25,
  money: 50,
  relationships: 25,
  energy: 100,
  stress: 15,
  confidence: 30,
};

export default function App() {
  // 3D Canvas ref & scene instance
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const gameSceneRef = useRef<GameScene | null>(null);

  // Game State
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number>(8.0); // 8:00 AM
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [activityHistory, setActivityHistory] = useState<string[]>([]);
  const [decisionsHistory, setDecisionsHistory] = useState<DecisionRecord[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // UI Modal States
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [activeZone, setActiveZone] = useState<InteractiveZone | null>(null);
  const [currentLocationModal, setCurrentLocationModal] = useState<LocationData | null>(null);
  const [currentNPCModal, setCurrentNPCModal] = useState<NPCData | null>(null);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [sleepModalData, setSleepModalData] = useState<{
    completedDay: number;
    nextDay: number;
    summary: DaySummary;
  } | null>(null);
  const [endGameProfile, setEndGameProfile] = useState<FinalProfile | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Player position tracker for radar / map
  const [playerPos, setPlayerPos] = useState<{ x: number; z: number }>({ x: -28, z: -16 });
  const [playerAngle, setPlayerAngle] = useState<number>(0);

  // Helper to add toast
  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize 3D Scene
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const scene = new GameScene(canvasContainerRef.current, {
      onZoneChange: (zone) => {
        setActiveZone(zone);
        if (zone) {
          soundManager.playInteract();
        }
      },
    });
    gameSceneRef.current = scene;

    // Tracker interval for player radar position
    const trackerInterval = setInterval(() => {
      if (scene && scene.player) {
        setPlayerPos({ x: scene.player.position.x, z: scene.player.position.z });
        setPlayerAngle(scene.player.rotationY);
      }
    }, 150);

    return () => {
      clearInterval(trackerInterval);
      scene.destroy();
      gameSceneRef.current = null;
    };
  }, []);

  // Update lighting when time of day changes
  useEffect(() => {
    if (gameSceneRef.current) {
      gameSceneRef.current.updateTimeOfDay(hour);
    }
  }, [hour]);

  // Keyboard Input Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();

      // Modal escape
      if (key === 'escape') {
        setCurrentLocationModal(null);
        setCurrentNPCModal(null);
        setShowMap(false);
        setShowHelp(false);
        return;
      }

      // Map toggle
      if (key === 'm') {
        setShowMap((prev) => !prev);
        return;
      }

      // Help toggle
      if (key === 'h') {
        setShowHelp((prev) => !prev);
        return;
      }

      // E or Space to Interact
      if (key === 'e' || (key === ' ' && !currentLocationModal && !currentNPCModal && !activeEvent)) {
        if (activeZone) {
          e.preventDefault();
          triggerActiveInteraction();
          return;
        }
      }

      // Movement keys
      if (gameSceneRef.current) {
        if (key === 'w' || key === 'arrowup') gameSceneRef.current.setInput('forward', true);
        if (key === 's' || key === 'arrowdown') gameSceneRef.current.setInput('backward', true);
        if (key === 'a' || key === 'arrowleft') gameSceneRef.current.setInput('left', true);
        if (key === 'd' || key === 'arrowright') gameSceneRef.current.setInput('right', true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (gameSceneRef.current) {
        if (key === 'w' || key === 'arrowup') gameSceneRef.current.setInput('forward', false);
        if (key === 's' || key === 'arrowdown') gameSceneRef.current.setInput('backward', false);
        if (key === 'a' || key === 'arrowleft') gameSceneRef.current.setInput('left', false);
        if (key === 'd' || key === 'arrowright') gameSceneRef.current.setInput('right', false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeZone, currentLocationModal, currentNPCModal, activeEvent]);

  // Check for dynamic events triggered by state
  const checkEvents = useCallback(
    (currentStats: PlayerStats, currentDay: number, currentHour: number, currentFlags: Set<string>) => {
      for (const event of GAME_EVENTS) {
        if (!currentFlags.has(event.id) && event.triggerCondition(currentStats, currentDay, currentHour, currentFlags)) {
          setActiveEvent(event);
          soundManager.playNotification();
          break;
        }
      }
    },
    []
  );

  // Trigger interaction with active zone
  const triggerActiveInteraction = useCallback(() => {
    if (!activeZone) return;

    if (activeZone.type === 'location') {
      const loc = LOCATIONS[activeZone.targetId];
      if (loc) {
        setCurrentLocationModal(loc);
        soundManager.playInteract();
      }
    } else if (activeZone.type === 'npc') {
      const npc = NPCS.find((n) => n.id === activeZone.targetId);
      if (npc) {
        setCurrentNPCModal(npc);
        soundManager.playInteract();
      }
    }
  }, [activeZone]);

  // Execute activity at a location
  const handleSelectActivity = (activity: Activity) => {
    // Special case: Sleep (End Day)
    if (activity.id === 'sleep_night') {
      setCurrentLocationModal(null);
      advanceDay();
      return;
    }

    // Apply stat changes
    const newStats: PlayerStats = {
      knowledge: Math.max(0, Math.min(100, stats.knowledge + (activity.statEffects.knowledge || 0))),
      money: Math.max(0, stats.money + (activity.statEffects.money || 0)),
      relationships: Math.max(0, Math.min(100, stats.relationships + (activity.statEffects.relationships || 0))),
      energy: Math.max(0, Math.min(100, stats.energy - activity.energyCost + (activity.statEffects.energy || 0))),
      stress: Math.max(0, Math.min(100, stats.stress + (activity.statEffects.stress || 0))),
      confidence: Math.max(0, Math.min(100, stats.confidence + (activity.statEffects.confidence || 0))),
    };

    setStats(newStats);
    setActivityHistory((prev) => [...prev, activity.title]);

    if (activity.unlockFlag) {
      setFlags((prev) => new Set([...prev, activity.unlockFlag!]));
    }

    // Advance time
    const newHour = hour + activity.timeHours;

    // Toast notification
    addToast({
      title: activity.title,
      message: activity.narrativeResult,
      statDeltas: activity.statEffects,
      type: 'success',
    });

    setCurrentLocationModal(null);

    // If midnight or exhausted, force sleep transition
    if (newHour >= 24 || newStats.energy <= 0) {
      advanceDay();
    } else {
      setHour(newHour);
      checkEvents(newStats, day, newHour, flags);
    }
  };

  // NPC dialogue interaction
  const handleNPCTalk = (topic: NPCData['dialogue']['topics'][0]) => {
    const timeSpent = topic.timeHours || 0.5;
    const energySpent = topic.energyCost || 5;

    const newStats: PlayerStats = {
      knowledge: Math.max(0, Math.min(100, stats.knowledge + (topic.statEffects?.knowledge || 0))),
      money: Math.max(0, stats.money + (topic.statEffects?.money || 0)),
      relationships: Math.max(0, Math.min(100, stats.relationships + (topic.statEffects?.relationships || 0))),
      energy: Math.max(0, Math.min(100, stats.energy - energySpent + (topic.statEffects?.energy || 0))),
      stress: Math.max(0, Math.min(100, stats.stress + (topic.statEffects?.stress || 0))),
      confidence: Math.max(0, Math.min(100, stats.confidence + (topic.statEffects?.confidence || 0))),
    };

    setStats(newStats);
    const newHour = hour + timeSpent;

    addToast({
      title: 'Meaningful Conversation',
      message: 'New perspectives gained.',
      statDeltas: topic.statEffects,
      type: 'info',
    });

    if (newHour >= 24 || newStats.energy <= 0) {
      setCurrentNPCModal(null);
      advanceDay();
    } else {
      setHour(newHour);
      checkEvents(newStats, day, newHour, flags);
    }
  };

  // Event choice committed
  const handleEventChoice = (choice: GameEventChoice) => {
    if (!activeEvent) return;

    const newFlags = new Set(flags);
    newFlags.add(activeEvent.id);
    if (choice.flagSet) {
      newFlags.add(choice.flagSet);
    }
    setFlags(newFlags);

    const timeSpent = choice.timeHours || 1;
    const energySpent = choice.energyCost || 10;

    const newStats: PlayerStats = {
      knowledge: Math.max(0, Math.min(100, stats.knowledge + (choice.statEffects.knowledge || 0))),
      money: Math.max(0, stats.money + (choice.statEffects.money || 0)),
      relationships: Math.max(0, Math.min(100, stats.relationships + (choice.statEffects.relationships || 0))),
      energy: Math.max(0, Math.min(100, stats.energy - energySpent + (choice.statEffects.energy || 0))),
      stress: Math.max(0, Math.min(100, stats.stress + (choice.statEffects.stress || 0))),
      confidence: Math.max(0, Math.min(100, stats.confidence + (choice.statEffects.confidence || 0))),
    };

    setStats(newStats);

    // Save decision to history
    setDecisionsHistory((prev) => [
      ...prev,
      {
        day,
        hour,
        title: activeEvent.title,
        choiceText: choice.text,
        outcome: choice.outcomeText,
        isPivotal: activeEvent.isPivotal,
      },
    ]);

    addToast({
      title: activeEvent.title,
      message: choice.outcomeText,
      statDeltas: choice.statEffects,
      type: 'success',
    });

    setActiveEvent(null);

    const newHour = hour + timeSpent;
    if (newHour >= 24 || newStats.energy <= 0) {
      advanceDay();
    } else {
      setHour(newHour);
    }
  };

  // Day Advancement & Sleep logic
  const advanceDay = () => {
    soundManager.playSleep();

    // Check if Day 7 just ended -> Final Life Profile
    if (day >= 7) {
      computeFinalProfile();
      return;
    }

    const journalNotes = [
      'The hum of the city streets gradually fades outside Unit 404. Tomorrow is another chapter.',
      'Reflecting on today’s choices: progress was made, even if some paths remained untraveled.',
      'Energy restored after deep sleep. The morning light spills across your desk blueprints.',
      'Midway through the week. The momentum in New Day City is building.',
      'Another week in university life. Trade-offs are real, but growth is undeniable.',
      'The weekend approaches. Saturday brought unexpected conversations and clarity.',
    ];

    const note = journalNotes[(day - 1) % journalNotes.length];

    setSleepModalData({
      completedDay: day,
      nextDay: day + 1,
      summary: {
        day,
        activitiesCompleted: activityHistory.length,
        energyUsed: 100 - stats.energy,
        moneyEarned: stats.money,
        stressPeak: stats.stress,
        note,
      },
    });
  };

  const handleWakeUp = () => {
    if (!sleepModalData) return;

    const nextDay = sleepModalData.nextDay;
    setDay(nextDay);
    setHour(8.0); // Reset to 8:00 AM

    // Reset energy to 100, relieve 20 stress
    setStats((prev) => ({
      ...prev,
      energy: 100,
      stress: Math.max(0, prev.stress - 20),
    }));

    // Teleport player back to apartment entrance
    if (gameSceneRef.current && gameSceneRef.current.player) {
      gameSceneRef.current.player.teleport(-28, -16);
    }

    setSleepModalData(null);

    addToast({
      title: `Day ${nextDay} Begun`,
      message: 'Sun rises over New Day City. 100% Energy restored.',
      type: 'info',
    });
  };

  // Compute final archetype & profile
  const computeFinalProfile = () => {
    let archetype: Archetype = 'The Balancer';
    let tagline = 'Master of Sustainable Equilibrium';
    let description =
      'You navigated New Day City with wisdom and restraint. When others sprinted toward exhaustion, you balanced ambition with recovery, finding peace in moderation.';
    let dominantStrength = 'Equilibrium & Longevity';
    let greatestTradeoff = 'Avoided extreme single-domain specialization';

    if (stats.knowledge >= 65 && stats.money >= 120) {
      archetype = 'The Achiever';
      tagline = 'Relentless High-Performer';
      description =
        'You treated New Day City as a crucible of mastery. High grades, technical contracts, and corporate opportunities fueled your engine. You pushed boundaries at the cost of personal quiet.';
      dominantStrength = 'Technical Excellence & Grit';
      greatestTradeoff = 'Elevated stress and sacrificed leisure';
    } else if (stats.relationships >= 60 && stats.confidence >= 55) {
      archetype = 'The Connector';
      tagline = 'The Heart of the Community';
      description =
        'People remember how you made them feel. From Maya’s project crunch to Leo’s cafe shifts and Sam’s park philosophy, your life was defined by the bonds you built.';
      dominantStrength = 'Empathy, Loyalty & Social Resonance';
      greatestTradeoff = 'Deferred personal solo projects for group causes';
    } else if (stats.knowledge >= 55 && flags.has('won_nexus_jam')) {
      archetype = 'The Builder';
      tagline = 'Pragmatic Creator & Innovator';
      description =
        'You were drawn to soldering irons, code repositories, and generative art. You chose to leave tangible artifacts in the world rather than just theoretical notes.';
      dominantStrength = 'Hands-on Prototyping & Ingenuity';
      greatestTradeoff = 'Consumed midnight oil on creative prototypes';
    } else if (flags.has('enjoyed_showcase_fellowship') || stats.stress <= 25) {
      archetype = 'The Dreamer';
      tagline = 'The Philosophical Wanderer';
      description =
        'You questioned the rat race from day one. You found poetry in park fountains, music in coffee shops, and understood that life is an experience to savor, not an exam to pass.';
      dominantStrength = 'Mindfulness, Clarity & Artistic Vision';
      greatestTradeoff = 'Ignored corporate ladder sprinting';
    } else {
      archetype = 'The Explorer';
      tagline = 'The Polymath Adventurer';
      description =
        'You visited every quarter of New Day City. You balanced lectures with coffee shifts, hardware tinkering with quiet park walks, refusing to be boxed into any single mold.';
      dominantStrength = 'Versatility & Adaptability';
      greatestTradeoff = 'Scattered focus across multiple disciplines';
    }

    // Most frequent activity
    const activityCounts: Record<string, number> = {};
    activityHistory.forEach((a) => {
      activityCounts[a] = (activityCounts[a] || 0) + 1;
    });
    let mostFrequent = 'Exploration Walk';
    let maxCount = 0;
    Object.entries(activityCounts).forEach(([act, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = act;
      }
    });

    // Pivotal decision
    const pivotal = decisionsHistory.find((d) => d.isPivotal) || decisionsHistory[0];
    const pivotalDecision = pivotal
      ? `${pivotal.title}: ${pivotal.choiceText}`
      : 'Supported Maya during the early semester project crunch';

    const opportunityReflection = flags.has('accepted_elena_internship')
      ? 'Secured the Apex Ventures Systems Internship through demonstrated technical ownership.'
      : flags.has('won_nexus_jam')
      ? 'Won 2nd place in the Midnight Nexus Creative Jam with your interactive prototype.'
      : flags.has('attended_maya_birthday')
      ? 'Solidified a lifelong friendship with Maya that will outlive any university deadline.'
      : 'Gained profound personal peace and self-trust in the open meadows of Starlight Park.';

    setEndGameProfile({
      archetype,
      tagline,
      description,
      dominantStrength,
      greatestTradeoff,
      mostFrequentActivity: mostFrequent,
      pivotalDecision,
      opportunityReflection,
      finalStats: { ...stats },
    });
  };

  // Restart playthrough
  const handleRestart = () => {
    setStats(INITIAL_STATS);
    setDay(1);
    setHour(8.0);
    setFlags(new Set());
    setActivityHistory([]);
    setDecisionsHistory([]);
    setEndGameProfile(null);
    setSleepModalData(null);
    setCurrentLocationModal(null);
    setCurrentNPCModal(null);
    setActiveEvent(null);

    if (gameSceneRef.current && gameSceneRef.current.player) {
      gameSceneRef.current.player.teleport(-28, -16);
    }

    addToast({
      title: 'Simulation Rebooted',
      message: 'New Day 1 has begun. Explore your path.',
      type: 'info',
    });
  };

  // Current objective suggestion
  const getObjectiveText = () => {
    if (stats.stress >= 65) return 'Stress is high! Unwind in Starlight Park or rest at Unit 404.';
    if (stats.energy <= 20) return 'Running low on energy! Order coffee at Cafe or sleep at Unit 404.';
    if (hour >= 21) return 'Evening settles in. Head back to Unit 404 Apartment to sleep.';
    if (day === 1) return 'Visit Metropolitan University or chat with Leo at Bean & Byte Cafe.';
    if (day === 2) return 'Explore the Apex Ventures Office Plaza or attend a Creative Hub workshop.';
    if (day === 4) return 'The Midnight Nexus Jam is happening at the Creative Hub!';
    if (day === 6) return 'Prepare for term evaluations or review with peers in the library.';
    if (day === 7) return 'The Sunday Community Showcase is active at Nexus Creative Hub!';
    return 'Explore New Day City, meet NPCs, and shape your week.';
  };

  // Mobile virtual joystick input handling
  const handleMobileMoveChange = (vector: { x: number; y: number }) => {
    if (!gameSceneRef.current) return;
    const threshold = 0.2;
    gameSceneRef.current.setInput('forward', vector.y < -threshold);
    gameSceneRef.current.setInput('backward', vector.y > threshold);
    gameSceneRef.current.setInput('left', vector.x < -threshold);
    gameSceneRef.current.setInput('right', vector.x > threshold);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Head-Up Display (HUD) */}
      <HUD
        stats={stats}
        day={day}
        hour={hour}
        activeZone={activeZone}
        onInteract={triggerActiveInteraction}
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = soundManager.toggleMute();
          setIsMuted(muted);
        }}
        onToggleMap={() => {
          soundManager.playClick();
          setShowMap((prev) => !prev);
        }}
        onToggleHelp={() => {
          soundManager.playClick();
          setShowHelp((prev) => !prev);
        }}
        playerPos={playerPos}
        playerAngle={playerAngle}
        currentObjective={getObjectiveText()}
      />

      {/* Mobile Touch Controls */}
      <MobileControls
        onMoveChange={handleMobileMoveChange}
        onInteract={triggerActiveInteraction}
        canInteract={!!activeZone}
      />

      {/* Floating Notifications */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />

      {/* MODALS */}
      {/* 1. Onboarding Intro */}
      {showOnboarding && <OnboardingModal onStart={() => setShowOnboarding(false)} />}

      {/* 2. Location Activity Interaction */}
      {currentLocationModal && (
        <InteractionModal
          location={currentLocationModal}
          stats={stats}
          currentHour={hour}
          onSelectActivity={handleSelectActivity}
          onClose={() => setCurrentLocationModal(null)}
        />
      )}

      {/* 3. NPC Conversation */}
      {currentNPCModal && (
        <NPCModal
          npc={currentNPCModal}
          stats={stats}
          onTalk={handleNPCTalk}
          onClose={() => setCurrentNPCModal(null)}
        />
      )}

      {/* 4. Story Event Scenario */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          stats={stats}
          onChoiceSelected={handleEventChoice}
        />
      )}

      {/* 5. Sleep & Night Day Transition */}
      {sleepModalData && (
        <SleepTransitionModal
          completedDay={sleepModalData.completedDay}
          nextDay={sleepModalData.nextDay}
          stats={stats}
          summary={sleepModalData.summary}
          onAdvanceDay={handleWakeUp}
        />
      )}

      {/* 6. Day 7 Final Life Profile */}
      {endGameProfile && (
        <EndGameProfileModal
          profile={endGameProfile}
          decisions={decisionsHistory}
          onRestart={handleRestart}
        />
      )}

      {/* 7. City Map Overview */}
      {showMap && (
        <CityMapModal
          playerPos={playerPos}
          onClose={() => setShowMap(false)}
        />
      )}

      {/* 8. Help / Guide */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
