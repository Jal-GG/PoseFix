import { pgTable, uuid, varchar, timestamp, text, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.ts';

export const trainerClientRelationships = pgTable(
  'trainer_client_relationships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    trainerId: uuid('trainer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    clientId: uuid('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 20, enum: ['pending', 'active', 'archived'] }).notNull().default('pending'),
    invitedAt: timestamp('invited_at').notNull().defaultNow(),
    acceptedAt: timestamp('accepted_at'),
    notes: text('notes'),
  },
  (table) => [
    uniqueIndex('trainer_client_unique_idx').on(table.trainerId, table.clientId),
    index('tcr_trainer_idx').on(table.trainerId),
    index('tcr_client_idx').on(table.clientId),
  ],
);
