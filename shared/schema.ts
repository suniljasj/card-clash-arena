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

// Friends system tables
export const friendRequests = pgTable("friend_requests", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => players.id).notNull(),
  receiverId: integer("receiver_id").references(() => players.id).notNull(),
  status: text("status").default("pending").notNull(), // pending, accepted, declined
  message: text("message"), // optional message with friend request
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
});

export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  playerOneId: integer("player_one_id").references(() => players.id).notNull(),
  playerTwoId: integer("player_two_id").references(() => players.id).notNull(),
  status: text("status").default("active").notNull(), // active, blocked
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastInteraction: timestamp("last_interaction").defaultNow().notNull(),
});

// Guild system tables
export const guilds = pgTable("guilds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  tag: text("tag").notNull().unique(), // 3-4 character guild tag
  ownerId: integer("owner_id").references(() => players.id).notNull(),
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  maxMembers: integer("max_members").default(20).notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  joinRequirement: integer("join_requirement").default(1).notNull(), // minimum player level
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const guildMembers = pgTable("guild_members", {
  id: serial("id").primaryKey(),
  guildId: integer("guild_id").references(() => guilds.id).notNull(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  role: text("role").default("member").notNull(), // member, officer, leader, owner
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  contributionPoints: integer("contribution_points").default(0).notNull(),
  lastActive: timestamp("last_active").defaultNow().notNull(),
});

export const guildInvites = pgTable("guild_invites", {
  id: serial("id").primaryKey(),
  guildId: integer("guild_id").references(() => guilds.id).notNull(),
  inviterId: integer("inviter_id").references(() => players.id).notNull(),
  inviteeId: integer("invitee_id").references(() => players.id).notNull(),
  status: text("status").default("pending").notNull(), // pending, accepted, declined, expired
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
  expiresAt: timestamp("expires_at").notNull(),
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

// Social features schemas
export const insertFriendRequestSchema = createInsertSchema(friendRequests).omit({
  id: true,
  createdAt: true,
});

export const insertFriendshipSchema = createInsertSchema(friendships).omit({
  id: true,
  createdAt: true,
  lastInteraction: true,
});

export const insertGuildSchema = createInsertSchema(guilds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGuildMemberSchema = createInsertSchema(guildMembers).omit({
  id: true,
  joinedAt: true,
  lastActive: true,
});

export const insertGuildInviteSchema = createInsertSchema(guildInvites).omit({
  id: true,
  createdAt: true,
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

// Social features types
export type InsertFriendRequest = z.infer<typeof insertFriendRequestSchema>;
export type FriendRequest = typeof friendRequests.$inferSelect;

export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
export type Friendship = typeof friendships.$inferSelect;

export type InsertGuild = z.infer<typeof insertGuildSchema>;
export type Guild = typeof guilds.$inferSelect;

export type InsertGuildMember = z.infer<typeof insertGuildMemberSchema>;
export type GuildMember = typeof guildMembers.$inferSelect;

export type InsertGuildInvite = z.infer<typeof insertGuildInviteSchema>;
export type GuildInvite = typeof guildInvites.$inferSelect;
