import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  username: text("username").notNull(),
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  gold: integer("gold").default(1000).notNull(),
  gems: integer("gems").default(50).notNull(),
  avatar: text("avatar").default("default"),
  rank: text("rank").default("Bronze").notNull(),
  wins: integer("wins").default(0).notNull(),
  losses: integer("losses").default(0).notNull(),
  totalGames: integer("total_games").default(0).notNull(),
  hasCompletedTutorial: boolean("has_completed_tutorial").default(false).notNull(),
  lastLoginBonus: timestamp("last_login_bonus"),
  achievements: jsonb("achievements").default([]).notNull(),
  activeDeckId: text("active_deck_id"),
  ownedCards: jsonb("owned_cards").default([]).notNull(),
  cardCounts: jsonb("card_counts").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const decks = pgTable("decks", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  cardIds: jsonb("card_ids").default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastModified: timestamp("last_modified").defaultNow().notNull(),
});

export const quests = pgTable("quests", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // daily, weekly, achievement
  progress: integer("progress").default(0).notNull(),
  maxProgress: integer("max_progress").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  isClaimed: boolean("is_claimed").default(false).notNull(),
  rewards: jsonb("rewards").default({}).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const battles = pgTable("battles", {
  id: text("id").primaryKey(),
  player1Id: integer("player1_id").references(() => users.id).notNull(),
  player2Id: integer("player2_id").references(() => users.id),
  player1DeckId: text("player1_deck_id"),
  player2DeckId: text("player2_deck_id"),
  status: text("status").notNull(), // active, completed, abandoned
  winner: text("winner"), // player1, player2, draw
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  gameState: jsonb("game_state").default({}).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeckSchema = createInsertSchema(decks).omit({
  createdAt: true,
  lastModified: true,
});

export const insertQuestSchema = createInsertSchema(quests).omit({
  createdAt: true,
});

export const insertBattleSchema = createInsertSchema(battles).omit({
  startedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type Deck = typeof decks.$inferSelect;

export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type Quest = typeof quests.$inferSelect;

export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Battle = typeof battles.$inferSelect;
