export enum AssessmentType {
  READING = 'reading',
  WRITING = 'writing',
  MATH = 'math',
  ATTENTION = 'attention'
}

export enum ConfidenceLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export type CharacterId = 'buddy' | 'luna' | 'pixel' | 'sunny';
export type CharacterMood = 'idle' | 'happy' | 'encouraging' | 'thinking' | 'celebrating';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  language: string;
  hasConsent: boolean;
  createdAt: number;
  xp: number;
  level: number;
  achievements: string[]; // IDs of unlocked achievements
  stars: Record<AssessmentType, number>; // Number of stars earned per assessment type
}

export interface Observation {
  timestamp?: string; // e.g., "0:15"
  observation: string;
  confidence: ConfidenceLevel;
  finding?: string; // For writing/static analysis
}

export interface AssessmentMetrics {
  // Reading
  estimatedWPM?: number;
  regressionCount?: number;
  engagementLevel?: 'high' | 'medium' | 'low';
  
  // Writing
  legibilityScore?: number;
  reversalCount?: number;
  spacingConsistency?: 'consistent' | 'inconsistent';

  // Math
  solutionTime?: number;
  strategyUsed?: string;
  accuracy?: 'correct' | 'incorrect';
  errorType?: 'calculation' | 'conceptual' | 'none';

  // Attention
  longestSustainedAttention?: number;
  distractionCount?: number;
  comparedToAgeNorm?: 'above' | 'average' | 'below';
}

export interface ActionPlanItem {
  action: string;
  priority: 'immediate' | 'short-term' | 'ongoing';
  type: 'professional' | 'home' | 'school';
}

export interface AssessmentResult {
  id: string;
  childId: string;
  type: AssessmentType;
  timestamp: number;
  overallConfidence: ConfidenceLevel;
  observations: Observation[];
  metrics: AssessmentMetrics;
  interpretation: string;
  recommendations: string[];
  actionPlan?: ActionPlanItem[];
  rawText?: string; // Captured text from handwriting
  
  // For Radar Chart
  skillDimensions?: {
    fluency: number;
    comprehension: number;
    focus: number;
    motorSkills: number;
    confidence: number;
  };
}

export interface LongitudinalTrend {
  improving: string[];
  stable: string[];
  declining: string[];
}