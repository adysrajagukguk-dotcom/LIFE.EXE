import { LocationData, NPCData } from '../types/game';

export const LOCATIONS: Record<string, LocationData> = {
  apartment: {
    id: 'apartment',
    name: 'Unit 404 Apartment',
    subtitle: 'Your Haven & Recharge Station',
    tagline: 'Quiet sanctuary to reset, sleep, and reflect.',
    description:
      'A compact loft apartment with warm oak shelves, an open laptop, and a view of the New Day City skyline. The bed offers deep restorative sleep to prepare for tomorrow.',
    position: [-28, 0, -26],
    radius: 7,
    color: '#3B82F6',
    accentColor: '#93C5FD',
    icon: 'Home',
    activities: [
      {
        id: 'sleep_night',
        title: 'Sleep (End the Day)',
        description: 'Get a full night’s sleep. Recharges energy to maximum, reduces stress, and advances to the next day.',
        timeHours: 8,
        energyCost: 0,
        statEffects: {
          energy: 100, // handled specially
          stress: -20,
        },
        narrativeResult: 'You sink into your blankets. Tomorrow brings another set of hours to spend.',
      },
      {
        id: 'power_nap',
        title: 'Take a 1-Hour Power Nap',
        description: 'A quick restorative rest on your desk chair or sofa.',
        timeHours: 1,
        energyCost: -15, // restores energy
        statEffects: {
          energy: 15,
          stress: -5,
        },
        narrativeResult: 'A 20-minute REM cycle leaves you with renewed clarity.',
      },
      {
        id: 'organize_notes',
        title: 'Organize Life Notes & Budget',
        description: 'Tidy up your planner, track weekly expenses, and center your thoughts.',
        timeHours: 1,
        energyCost: 10,
        statEffects: {
          confidence: 8,
          stress: -8,
        },
        narrativeResult: 'Your thoughts are clear. Having a plan takes the edge off city chaos.',
      },
    ],
  },

  university: {
    id: 'university',
    name: 'Metropolitan University',
    subtitle: 'Department of Computing & Design',
    tagline: 'The halls of knowledge, lectures, and challenging deadlines.',
    description:
      'Colonnaded limestone meets geometric glass facades. Students gather in the library quad debating algorithms, design systems, and semester projects.',
    position: [-26, 0, 26],
    radius: 7.5,
    color: '#8B5CF6',
    accentColor: '#C4B5FD',
    icon: 'GraduationCap',
    activities: [
      {
        id: 'attend_lecture',
        title: 'Attend Advanced Systems Lecture',
        description: 'Immerse in intensive software architectures and data models with Professor Vance.',
        timeHours: 2,
        energyCost: 20,
        statEffects: {
          knowledge: 18,
          stress: 8,
          confidence: 5,
        },
        requires: { minEnergy: 20 },
        narrativeResult: 'Your notebook is packed with diagrams. Complex concepts start clicking.',
      },
      {
        id: 'deep_study_library',
        title: 'Deep Study Session at Quiet Floor',
        description: 'Isolate yourself in the university library stacks with espresso and reference manuals.',
        timeHours: 3,
        energyCost: 25,
        statEffects: {
          knowledge: 25,
          stress: 12,
        },
        requires: { minEnergy: 25 },
        narrativeResult: 'Hours fly by in silence. You master key exam concepts ahead of schedule.',
      },
      {
        id: 'study_group',
        title: 'Join Maya’s Project Sprint',
        description: 'Collaborate with fellow peers on the term capstone project.',
        timeHours: 2,
        energyCost: 20,
        statEffects: {
          knowledge: 14,
          relationships: 12,
          stress: 5,
        },
        requires: { minEnergy: 20 },
        narrativeResult: 'Teamwork pays off. Brainstorming with others speeds up the prototype.',
      },
    ],
  },

  cafe: {
    id: 'cafe',
    name: 'Bean & Byte Cafe',
    subtitle: 'Coffee, Code & Conversations',
    tagline: 'Warm espresso aroma, ambient lo-fi music, and buzzing creatives.',
    description:
      'A warm brick-and-timber coffee bar lined with potted monsteras and glowing laptops. Leo serves cold brews while discussing indie game prototypes.',
    position: [24, 0, -26],
    radius: 7,
    color: '#F59E0B',
    accentColor: '#FDE68A',
    icon: 'Coffee',
    activities: [
      {
        id: 'buy_specialty_coffee',
        title: 'Order Double-Shot Cortado ($6)',
        description: 'An artisanal roast brewed to perfection. Rapid energy recharge with mild jitters.',
        timeHours: 0.5,
        energyCost: -25, // gain energy
        statEffects: {
          money: -6,
          energy: 25,
          confidence: 4,
        },
        requires: { minMoney: 6 },
        narrativeResult: 'Rich, smooth crema. You feel a crisp surge of caffeine alertness.',
      },
      {
        id: 'barista_shift',
        title: 'Work a 3-Hour Barista Shift ($55)',
        description: 'Steam milk, pull espresso shots, and serve the rush of afternoon customers.',
        timeHours: 3,
        energyCost: 30,
        statEffects: {
          money: 55,
          energy: -30,
          stress: 10,
          relationships: 6,
        },
        requires: { minEnergy: 30 },
        narrativeResult: 'A sweaty, fast-paced shift. Your wallet is healthier and regulars waved goodbye.',
      },
      {
        id: 'socialize_cafe',
        title: 'Hang Out & Talk Tech with Leo',
        description: 'Share a booth with barista/game dev Leo and exchange creative ideas.',
        timeHours: 2,
        energyCost: 15,
        statEffects: {
          relationships: 16,
          stress: -10,
          confidence: 8,
        },
        requires: { minEnergy: 15 },
        narrativeResult: 'Leo shares insights on building creative projects without burning out.',
      },
    ],
  },

  office: {
    id: 'office',
    name: 'Apex Ventures Office',
    subtitle: 'Tech Hub & Enterprise Plaza',
    tagline: 'High glass ceilings, fast-paced teams, and high career stakes.',
    description:
      'A glass-and-steel commercial tower housing cutting-edge startups and consulting firms. Elena leads an energetic product team scouting student talent.',
    position: [28, 0, 26],
    radius: 7.5,
    color: '#06B6D4',
    accentColor: '#A5F3FC',
    icon: 'Briefcase',
    activities: [
      {
        id: 'freelance_gig',
        title: 'Execute Client Code Sprint ($80)',
        description: 'Build a production feature module for a corporate client on deadline.',
        timeHours: 3,
        energyCost: 35,
        statEffects: {
          money: 80,
          knowledge: 8,
          stress: 18,
          confidence: 10,
        },
        requires: { minEnergy: 35, minKnowledge: 20 },
        narrativeResult: 'Clean commits, passing test suites. The client transfers your payment on time.',
      },
      {
        id: 'internship_interview',
        title: 'Pitch Internship Portfolio to Elena',
        description: 'Present your past work and vision to Elena for an upcoming summer role.',
        timeHours: 1.5,
        energyCost: 20,
        statEffects: {
          confidence: 16,
          stress: 14,
          relationships: 10,
        },
        requires: { minEnergy: 20, minConfidence: 25 },
        narrativeResult: 'Elena listens attentively and takes notes. She is impressed by your authenticity.',
        unlockFlag: 'elena_pitch_done',
      },
      {
        id: 'career_networking',
        title: 'Attend Executive Mixer',
        description: 'Mingle with senior directors and tech leads in the penthouse atrium.',
        timeHours: 2,
        energyCost: 25,
        statEffects: {
          relationships: 14,
          confidence: 12,
          stress: 10,
        },
        requires: { minEnergy: 25 },
        narrativeResult: 'You collect contacts and gain realistic perspective on industry career ladders.',
      },
    ],
  },

  park: {
    id: 'park',
    name: 'Starlight City Park',
    subtitle: 'Green Canopy & Reflective Pond',
    tagline: 'A breath of fresh air amidst the rhythmic bustle of city life.',
    description:
      'Meandering stone pathways flanked by blossoming cherry trees, quiet park benches, and a central stone fountain. Sam sits playing an acoustic guitar.',
    position: [0, 0, -28],
    radius: 8,
    color: '#10B981',
    accentColor: '#6EE7B7',
    icon: 'Trees',
    activities: [
      {
        id: 'meditate_walk',
        title: 'Take a Mindful Walk by the Pond',
        description: 'Leave your phone in your pocket, listen to rustling leaves, and breathe deeply.',
        timeHours: 1,
        energyCost: -10, // restores 10 energy
        statEffects: {
          energy: 10,
          stress: -22,
          confidence: 6,
        },
        narrativeResult: 'The quiet ripple of the water washes away lingering mental clutter.',
      },
      {
        id: 'jogging_exercise',
        title: 'Go for a 5km Jog',
        description: 'Lace up your running shoes and push your pace around the park perimeter.',
        timeHours: 1.5,
        energyCost: 20,
        statEffects: {
          stress: -18,
          confidence: 14,
          energy: -5,
        },
        requires: { minEnergy: 20 },
        narrativeResult: 'Endorphins flood in. You feel physically invigorated and sharp.',
      },
      {
        id: 'chat_with_sam',
        title: 'Philosophy Chat with Sam',
        description: 'Discuss life pacing, ambition, and contentment with the resident street philosopher.',
        timeHours: 1.5,
        energyCost: 10,
        statEffects: {
          relationships: 12,
          stress: -15,
          confidence: 8,
        },
        narrativeResult: 'Sam smiles: "Remember, life is not a benchmark test. You do not need to max out every metric."',
      },
    ],
  },

  creative_hub: {
    id: 'creative_hub',
    name: 'Nexus Creative Hub',
    subtitle: 'Makerspace & Digital Arts Lab',
    tagline: 'Laser cutters, digital synthesizers, and boundary-pushing projects.',
    description:
      'An industrial warehouse converted into a collaborative makerspace. Kai experiments with interactive projection mapping while students solder circuit boards.',
    position: [0, 0, 28],
    radius: 7.5,
    color: '#EC4899',
    accentColor: '#F472B6',
    icon: 'Sparkles',
    activities: [
      {
        id: 'design_workshop',
        title: 'Attend Generative Design Workshop',
        description: 'Learn shader programming and generative algorithmic aesthetics with Kai.',
        timeHours: 2.5,
        energyCost: 22,
        statEffects: {
          knowledge: 15,
          confidence: 12,
          stress: -4,
        },
        requires: { minEnergy: 22 },
        narrativeResult: 'You create stunning generative visual patterns. Creative excitement is infectious.',
      },
      {
        id: 'prototype_hack',
        title: 'Build Hardware / Creative Prototype',
        description: 'Tinker with microcontrollers and rapid prototyping tools to build an interactive gadget.',
        timeHours: 3,
        energyCost: 30,
        statEffects: {
          knowledge: 18,
          confidence: 16,
          stress: 8,
        },
        requires: { minEnergy: 30 },
        narrativeResult: 'The LEDs light up, sensor readings stabilize. You built something tangible with your own hands.',
      },
      {
        id: 'creative_collab',
        title: 'Collaborate with Kai on Art Installation',
        description: 'Join forces on a community light installation for New Day City’s weekend showcase.',
        timeHours: 2,
        energyCost: 18,
        statEffects: {
          relationships: 15,
          confidence: 12,
          knowledge: 8,
        },
        requires: { minEnergy: 18 },
        narrativeResult: 'Kai enthusiastically incorporates your logic code into the physical light sculpture.',
        unlockFlag: 'kai_art_exhibit_ready',
      },
    ],
  },
};

export const NPCS: NPCData[] = [
  {
    id: 'npc_maya',
    name: 'Maya Chen',
    title: 'Computer Science Peer',
    locationId: 'university',
    position: [-22, 0, 22],
    color: '#8B5CF6',
    dialogueState: 0,
    relationshipScore: 35,
    avatarIcon: 'GraduationCap',
    dialogue: {
      greeting: 'Hey! Are you reviewing for the distributed systems exam or taking a quick breather?',
      topics: [
        {
          label: 'Ask about the upcoming group project',
          response:
            'I’m hoping we can partner up! Most people procrastinate until the final weekend, but if we plan ahead, we can build something truly impressive.',
          timeHours: 0.5,
          energyCost: 5,
          statEffects: { relationships: 6, knowledge: 4 },
        },
        {
          label: 'Share study notes and tips',
          response:
            'These notes on concurrency are brilliant! Thank you so much. Here, let me share my summaries for algorithms in return.',
          timeHours: 0.5,
          energyCost: 5,
          statEffects: { relationships: 10, knowledge: 8, confidence: 4 },
        },
      ],
    },
  },
  {
    id: 'npc_leo',
    name: 'Leo Morales',
    title: 'Barista & Indie Dev',
    locationId: 'cafe',
    position: [20, 0, -22],
    color: '#F59E0B',
    dialogueState: 0,
    relationshipScore: 30,
    avatarIcon: 'Coffee',
    dialogue: {
      greeting: 'Welcome to Bean & Byte! Fuel for the mind, or need someone to bounce ideas off?',
      topics: [
        {
          label: 'Talk about indie game development',
          response:
            'I’ve been working on a retro synthwave puzzle game after my shifts. It’s hard balancing 30 hours of cafe work with code, but building what you love keeps you alive.',
          timeHours: 0.5,
          energyCost: 5,
          statEffects: { relationships: 8, confidence: 6 },
        },
        {
          label: 'Ask for advice on managing burnout',
          response:
            'Rule number one: sleep is non-negotiable. If you try to burn 16 hours every single day, your brain will forcibly shut you down at the worst possible moment. Pacing is king.',
          timeHours: 0.5,
          energyCost: 0,
          statEffects: { stress: -8, relationships: 5 },
        },
      ],
    },
  },
  {
    id: 'npc_elena',
    name: 'Elena Rostova',
    title: 'Managing Director, Apex Ventures',
    locationId: 'office',
    position: [24, 0, 22],
    color: '#06B6D4',
    dialogueState: 0,
    relationshipScore: 20,
    avatarIcon: 'Briefcase',
    dialogue: {
      greeting: 'Good afternoon. In this city, time is everyone’s most scarce asset. What’s on your mind?',
      topics: [
        {
          label: 'Inquire about what she looks for in interns',
          response:
            'Not just textbook GPA. I look for students who can ship real solutions under ambiguity, communicate concisely, and know how to prioritize when everything is on fire.',
          timeHours: 0.5,
          energyCost: 5,
          statEffects: { knowledge: 6, confidence: 6 },
        },
        {
          label: 'Discuss industry trends in generative technology',
          response:
            'It’s moving exponentially. The engineers who win aren’t just tool operators—they understand user psychology and system architecture from first principles.',
          timeHours: 0.5,
          energyCost: 5,
          statEffects: { knowledge: 8, confidence: 8, relationships: 6 },
        },
      ],
    },
  },
  {
    id: 'npc_sam',
    name: 'Sam Brooks',
    title: 'Park Resident & Street Musician',
    locationId: 'park',
    position: [4, 0, -22],
    color: '#10B981',
    dialogueState: 0,
    relationshipScore: 40,
    avatarIcon: 'Trees',
    dialogue: {
      greeting: 'Sit with me a moment. The clouds are moving slow today.',
      topics: [
        {
          label: 'Talk about feeling pressured to do everything',
          response:
            'Look at the city skyline from here. Everyone is rushing toward an imaginary finish line. But life isn’t an exam where you get points for suffering. Enjoy the walk.',
          timeHours: 0.5,
          energyCost: 0,
          statEffects: { stress: -14, confidence: 5 },
        },
        {
          label: 'Listen to Sam play a peaceful song',
          response:
            'Sam tunes their acoustic guitar and plays a gentle chord melody that harmonizes with the wind through the pines.',
          timeHours: 0.5,
          energyCost: -5,
          statEffects: { stress: -18, relationships: 8 },
        },
      ],
    },
  },
  {
    id: 'npc_kai',
    name: 'Kai Rivera',
    title: 'Lead Maker, Nexus Studio',
    locationId: 'creative_hub',
    position: [4, 0, 22],
    color: '#EC4899',
    dialogueState: 0,
    relationshipScore: 25,
    avatarIcon: 'Sparkles',
    dialogue: {
      greeting: 'Hey maker! Smell that solder smoke? We’re building interactive kinetic art today.',
      topics: [
        {
          label: 'Ask to inspect the interactive LED sculpture',
          response:
            'It’s reacting to ambient acoustic frequencies in the room! If you want, you can help me write the noise filtering algorithm for the microcontrollers.',
          timeHours: 0.5,
          energyCost: 5,
          statEffects: { knowledge: 8, relationships: 8 },
        },
        {
          label: 'Discuss combining engineering with art',
          response:
            'Pure logic without aesthetics is sterile. Pure aesthetics without structure falls apart. When you merge both, people stop and stare in awe.',
          timeHours: 0.5,
          energyCost: 5,
          statEffects: { confidence: 10, relationships: 6 },
        },
      ],
    },
  },
];
