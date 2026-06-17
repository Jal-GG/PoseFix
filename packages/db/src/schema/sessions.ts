import { pgTable, uuid, varchar, integer, timestamp, text, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users.ts';

export const sessionTemplates = pgTable(
  'session_templates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    trainerId: uuid('trainer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    type: varchar('type', { length: 30, enum: ['yoga', 'physiotherapy', 'stretching'] }).notNull(),
    difficulty: varchar('difficulty', { length: 20, enum: ['beginner', 'intermediate', 'advanced'] }).notNull().default('beginner'),
    durationMinutes: integer('duration_minutes').notNull(),
    poseSequence: jsonb('pose_sequence').notNull().$type<Array<{
      poseId: string;
      durationSeconds: number;
      coachingNotes?: string;
      transitionSeconds?: number;
    }>>(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('st_trainer_idx').on(table.trainerId),
    index('st_type_idx').on(table.type),
  ],
);

export const sessionsTable = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    templateId: uuid('template_id').references(() => sessionTemplates.id),
    clientUserId: uuid('client_user_id').notNull().references(() => users.id),
    trainerUserId: uuid('trainer_user_id').notNull().references(() => users.id),
    startedAt: timestamp('started_at').notNull().defaultNow(),
    endedAt: timestamp('ended_at'),
    status: varchar('status', { length: 20, enum: ['scheduled', 'in_progress', 'completed', 'abandoned'] }).notNull().default('scheduled'),
    settings: jsonb('settings').notNull().$type<{
      voiceCuesEnabled: boolean;
      sensitivityThreshold: number;
      frameRate: number;
    }>().default({ voiceCuesEnabled: true, sensitivityThreshold: 0.6, frameRate: 30 }),
  },
  (table) => [
    index('sessions_client_idx').on(table.clientUserId),
    index('sessions_trainer_idx').on(table.trainerUserId),
    index('sessions_status_idx').on(table.status),
    index('sessions_started_idx').on(table.startedAt),
  ],
);
