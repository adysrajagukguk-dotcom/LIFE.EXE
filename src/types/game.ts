export type LocationId =
  | 'apartment'
  | 'university'
  | 'cafe'
  | 'office'
  | 'park'
  | 'creative_hub';

export interface PlayerStats {
  knowledge: number;     // 0 - 100
  money: number;         // 0 - 100+ (or in $)
  relationships: number; // 0 - 100
  energy: number;        // 0 - 100
  stress: number;        // 0 - 100
  confidence: number;    // 0 - 100
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  timeHours: number;
  energyCost: number;
  statEffects: Partial<PlayerStats>;
  requires?: {
    minEnergy?: number;
    minMoney?: number;
    minKnowledge?: number;
    minConfidence?: number;
    maxStress?: number;
  };
  narrativeResult: string;
  unlockFlag?: string;
}

export interface NPCData {
  id: string;
  name: string;
  title: string;
  locationId: LocationId;
  position: [number, number, number];
  color: string;
  dialogueState: number;
  relationshipScore: number;
  avatarIcon: string;
  dialogue: {
    greeting: string;
    topics: {
      label: string;
      response: string;
      energyCost?: number;
      timeHours?: number;
      statEffects?: Partial<PlayerStats>;
      unlockFlag?: string;
    }[];
  };
}

export interface LocationData {
  id: LocationId;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  position: [number, number, number]; // [x, y, z] in 3D world
  radius: number;
  color: string;
  accentColor: string;
  icon: string;
  activities: Activity[];
}

export interface GameEventChoice {
  text: string;
  description: string;
  timeHours?: number;
  energyCost?: number;
  statEffects: Partial<PlayerStats>;
  flagRequirement?: string;
  flagSet?: string;
  outcomeText: string;
}

export interface GameEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  npcId?: string;
  locationId?: LocationId;
  triggerCondition: (stats: PlayerStats, day: number, hour: number, flags: Set<string>) => boolean;
  choices: GameEventChoice[];
  isPivotal?: boolean;
}

export interface DecisionRecord {
  day: number;
  hour: number;
  title: string;
  choiceText: string;
  outcome: string;
  isPivotal?: boolean;
}

export interface DaySummary {
  day: number;
  activitiesCompleted: number;
  energyUsed: number;
  moneyEarned: number;
  stressPeak: number;
  note: string;
}

export type Archetype =
  | 'The Achiever'
  | 'The Connector'
  | 'The Builder'
  | 'The Balancer'
  | 'The Explorer'
  | 'The Dreamer';

export interface FinalProfile {
  archetype: Archetype;
  tagline: string;
  description: string;
  dominantStrength: string;
  greatestTradeoff: string;
  mostFrequentActivity: string;
  pivotalDecision: string;
  opportunityReflection: string;
  finalStats: PlayerStats;
}
