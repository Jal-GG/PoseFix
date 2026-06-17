import { pgTable, uuid, varchar, timestamp, text, jsonb, index, boolean } from 'drizzle-orm/pg-core';

export const reports = pgTable(
  'reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: uuid('session_id').notNull(),
    trainerId: uuid('trainer_id').notNull(),
    clientId: uuid('client_id').notNull(),
    generatedAt: timestamp('generated_at').notNull().defaultNow(),
    status: varchar('status', { length: 20, enum: ['generating', 'ready', 'failed'] }).notNull().default('generating'),
    summaryStats: jsonb('summary_stats').$type<{
      totalActiveTimeSeconds: number;
      averageScore: number;
      scoreTrajectory: string;
      totalMistakes: number;
      mistakeFreePercentage: number;
      peakScore: number;
    }>(),
    pdfUrl: text('pdf_url'),
    trainerNotes: text('trainer_notes'),
  },
  (table) => [
    index('reports_session_idx').on(table.sessionId),
    index('reports_trainer_idx').on(table.trainerId),
    index('reports_client_idx').on(table.clientId),
  ],
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    body: text('body'),
    data: jsonb('data').$type<Record<string, unknown>>(),
    read: boolean('read').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('notifications_user_idx').on(table.userId),
    index('notifications_read_idx').on(table.userId, table.read),
  ],
);
