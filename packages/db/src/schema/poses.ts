import { pgTable, uuid, varchar, integer, timestamp, text, jsonb, index, real, boolean } from 'drizzle-orm/pg-core';

export const poseLibrary = pgTable(
  'pose_library',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    type: varchar('type', { length: 30, enum: ['yoga', 'physiotherapy', 'stretching'] }).notNull(),
    difficulty: varchar('difficulty', { length: 20, enum: ['beginner', 'intermediate', 'advanced'] }).notNull().default('beginner'),
    description: text('description'),
    referenceAngles: jsonb('reference_angles').notNull().$type<Array<{
      jointName: string;
      idealAngleDegrees: number;
      toleranceDegrees: number;
      critical: boolean;
      weight: number;
    }>>(),
    alignmentChecks: jsonb('alignment_checks').notNull().$type<Array<{
      checkName: string;
      description: string;
      thresholdDegrees: number;
      critical: boolean;
    }>>(),
    commonMistakes: jsonb('common_mistakes').notNull().$type<Array<{
      code: string;
      name: string;
      description: string;
      severity: string;
      conditions: unknown[];
      userMessage: string;
      trainerNote: string;
      affectedLandmarks: number[];
    }>>(),
    contraindications: jsonb('contraindications').$type<string[]>(),
    thumbnailUrl: text('thumbnail_url'),
    videoGuideUrl: text('video_guide_url'),
    coachingCues: jsonb('coaching_cues').$type<string[]>(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('pl_type_idx').on(table.type),
    index('pl_difficulty_idx').on(table.difficulty),
  ],
);

export const poseAttempts = pgTable(
  'pose_attempts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: uuid('session_id').notNull(),
    poseId: uuid('pose_id').notNull(),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
    overallScore: real('overall_score').notNull(),
    jointScores: jsonb('joint_scores').notNull().$type<Record<string, number>>(),
    detectedMistakes: jsonb('detected_mistakes').notNull().$type<Array<{
      code: string;
      severity: string;
      count: number;
    }>>(),
    landmarkData: jsonb('landmark_data').$type<Record<string, { x: number; y: number; z: number; visibility: number }>>(),
    phase: varchar('phase', { length: 20, enum: ['entry', 'hold', 'release'] }).notNull().default('hold'),
    confidence: real('confidence').notNull().default(1.0),
    isMistakeFrame: boolean('is_mistake_frame').notNull().default(false),
  },
  (table) => [
    index('pa_session_timestamp_idx').on(table.sessionId, table.timestamp),
    index('pa_session_pose_idx').on(table.sessionId, table.poseId),
    index('pa_timestamp_idx').on(table.timestamp),
  ],
);
