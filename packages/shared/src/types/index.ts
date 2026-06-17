import type {
  MistakeSeverity,
  PosePhase,
  PoseCategory,
  DifficultyLevel,
  UserRole,
  SessionStatus,
  RelationshipStatus,
  ReportStatus,
} from '../constants/index.ts';

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export type LandmarkData = Record<number, Landmark>;

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface JointAngle {
  jointName: string;
  angleDegrees: number;
  idealRange: [number, number];
  subScore: number;
  weight: number;
}

export interface AlignmentCheck {
  checkName: string;
  passed: boolean;
  deviation: number;
  threshold: number;
}

export interface MistakeDetection {
  code: string;
  severity: MistakeSeverity;
  userMessage: string;
  trainerNote: string;
  affectedLandmarks: number[];
  frameCount: number;
}

export interface PoseScore {
  overall: number;
  band: 'Good Form' | 'Acceptable' | 'Needs Correction' | 'Priority Correction';
  jointAngles: JointAngle[];
  alignmentChecks: AlignmentCheck[];
  mistakes: MistakeDetection[];
  phase: PosePhase;
  confidence: number;
}

export interface JointTarget {
  jointName: string;
  idealAngleDegrees: number;
  toleranceDegrees: number;
  critical: boolean;
  weight: number;
}

export interface AlignmentTarget {
  checkName: string;
  description: string;
  thresholdDegrees: number;
  critical: boolean;
}

export interface MistakePattern {
  code: string;
  name: string;
  description: string;
  severity: MistakeSeverity;
  conditions: MistakeCondition[];
  userMessage: string;
  trainerNote: string;
  affectedLandmarks: number[];
}

export interface MistakeCondition {
  type: 'joint_angle' | 'alignment' | 'symmetry';
  jointName?: string;
  checkName?: string;
  operator: 'lt' | 'gt' | 'lte' | 'gte' | 'eq' | 'out_of_range';
  value: number;
  tolerance?: number;
}

export interface PhaseDefinition {
  name: PosePhase;
  criteria: {
    jointTargets: Partial<Record<string, number>>;
    alignmentChecks: string[];
  };
  durationSeconds?: number;
}

export interface PoseDefinition {
  id: string;
  name: string;
  category: PoseCategory;
  difficulty: DifficultyLevel;
  description: string;
  contraindications: string[];
  jointTargets: JointTarget[];
  alignmentChecks: AlignmentTarget[];
  phases: PhaseDefinition[];
  mistakePatterns: MistakePattern[];
  thumbnailUrl?: string;
  videoGuideUrl?: string;
  coachingCues: string[];
}

export interface PoseAttempt {
  id?: string;
  sessionId: string;
  poseId: string;
  timestamp: Date;
  overallScore: number;
  jointScores: Record<string, number>;
  detectedMistakes: Array<{
    code: string;
    severity: MistakeSeverity;
    count: number;
  }>;
  landmarkData?: LandmarkData;
  phase: PosePhase;
  confidence: number;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  timezone: string;
  profilePhotoUrl?: string;
  onboardingCompleted: boolean;
  healthProfile?: HealthProfile;
}

export interface HealthProfile {
  age: number;
  fitnessLevel: DifficultyLevel;
  injuries: string[];
  goals: string[];
}

export interface Session {
  id: string;
  templateId: string;
  clientUserId: string;
  trainerUserId: string;
  startedAt: Date;
  endedAt?: Date;
  status: SessionStatus;
  settings: SessionSettings;
}

export interface SessionSettings {
  voiceCuesEnabled: boolean;
  sensitivityThreshold: number;
  frameRate: number;
}

export interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  type: PoseCategory;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  poseSequence: PoseSequenceItem[];
}

export interface PoseSequenceItem {
  poseId: string;
  durationSeconds: number;
  coachingNotes?: string;
  transitionSeconds?: number;
}

export interface TrainerClientRelationship {
  id: string;
  trainerId: string;
  clientId: string;
  status: RelationshipStatus;
  invitedAt: Date;
  acceptedAt?: Date;
  notes?: string;
}

export interface Report {
  id: string;
  sessionId: string;
  generatedAt: Date;
  status: ReportStatus;
  summaryStats: ReportSummary;
  pdfUrl?: string;
}

export interface ReportSummary {
  totalActiveTimeSeconds: number;
  averageScore: number;
  scoreTrajectory: 'improving' | 'declining' | 'stable';
  totalMistakes: number;
  mistakeFreePercentage: number;
  peakScore: number;
  peakScoreTimestamp: Date;
  perPoseStats: PerPoseStats[];
  mistakeAnalysis: MistakeAnalysisItem[];
}

export interface PerPoseStats {
  poseId: string;
  meanScore: number;
  stdDevScore: number;
  timeInFormPercentage: number;
  topMistakes: Array<{ code: string; count: number }>;
  holdCompleted: boolean;
}

export interface MistakeAnalysisItem {
  code: string;
  totalIntervals: number;
  percentageOfSession: number;
  commonPoses: string[];
  fatiguePattern: boolean;
}

export interface WebSocketMessage {
  type: 'pose_snapshot' | 'session_control' | 'trainer_message' | 'system_alert';
  sessionId: string;
  timestamp: number;
  payload: unknown;
}

export interface PoseSnapshotPayload {
  currentPoseId: string;
  overallScore: number;
  jointScores: Record<string, number>;
  mistakes: MistakeDetection[];
  phase: PosePhase;
  confidence: number;
  bestLandmarkFrame?: LandmarkData;
}

export interface TrainerMessagePayload {
  message: string;
  timestamp: number;
}
