export const LANDMARK_INDICES = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

export type LandmarkIndex = (typeof LANDMARK_INDICES)[keyof typeof LANDMARK_INDICES];

export const POSE_CATEGORIES = ['yoga', 'physiotherapy', 'stretching'] as const;
export type PoseCategory = (typeof POSE_CATEGORIES)[number];

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const SESSION_STATUSES = ['scheduled', 'in_progress', 'completed', 'abandoned'] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const RELATIONSHIP_STATUSES = ['pending', 'active', 'archived'] as const;
export type RelationshipStatus = (typeof RELATIONSHIP_STATUSES)[number];

export const USER_ROLES = ['client', 'trainer', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SCORE_BANDS = {
  GOOD_FORM: { min: 85, max: 100, label: 'Good Form' },
  ACCEPTABLE: { min: 70, max: 84, label: 'Acceptable' },
  NEEDS_CORRECTION: { min: 50, max: 69, label: 'Needs Correction' },
  PRIORITY: { min: 0, max: 49, label: 'Priority Correction' },
} as const;

export const MISTAKE_SEVERITIES = ['low', 'medium', 'high'] as const;
export type MistakeSeverity = (typeof MISTAKE_SEVERITIES)[number];

export const POSE_PHASES = ['entry', 'hold', 'release'] as const;
export type PosePhase = (typeof POSE_PHASES)[number];

export const REPORT_STATUSES = ['generating', 'ready', 'failed'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];
