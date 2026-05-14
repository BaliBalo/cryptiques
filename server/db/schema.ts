import { pgTable, boolean, integer, jsonb, uuid, text, timestamp, unique, uniqueIndex, index, date, decimal } from 'drizzle-orm/pg-core';

export const users = pgTable(
	'users',
	{
		id: uuid().primaryKey().defaultRandom(),
		createdAt: timestamp().notNull().defaultNow(),
		lastLogin: timestamp().notNull().defaultNow(),
		email: text().notNull(),
		name: text(),
		admin: boolean().notNull().default(false),
		banned: boolean().notNull().default(false),
	},
	table => [
		uniqueIndex().on(table.email),
	],
);

export const clues = pgTable(
	'clues',
	{
		id: uuid().primaryKey().defaultRandom(),
		createdAt: timestamp().notNull().defaultNow(),
		author: uuid().notNull().references(() => users.id),
		authorName: text().notNull(),
		content: text().notNull(),
		answer: text().notNull(),
		hints: jsonb(),
		notes: text(),
		nsfw: boolean().notNull().default(false),
		featured: boolean().notNull().default(false),
		clueOfTheDay: date(),
	},
	table => [
		index().on(table.author),
		index().on(table.createdAt),
		index().on(table.featured),
		uniqueIndex().on(table.clueOfTheDay),
	],
);

export const solves = pgTable(
	'solves',
	{
		id: uuid().primaryKey().defaultRandom(),
		createdAt: timestamp().notNull().defaultNow(),
		clueId: uuid().notNull().references(() => clues.id),
		userId: uuid().notNull().references(() => users.id),
		time: integer().default(0),
		hints: integer().default(0),
	},
	table => [
		unique().on(table.clueId, table.userId),
		index().on(table.userId),
		index().on(table.clueId),
	],
);

export const cluesQualityVotes = pgTable(
	'cluesQualityVotes',
	{
		id: uuid().primaryKey().defaultRandom(),
		createdAt: timestamp().notNull().defaultNow(),
		clueId: uuid().notNull().references(() => clues.id),
		userId: uuid().notNull().references(() => users.id),
		like: boolean(), // NULL = no vote, true = like, false = dislike
	},
	table => [
		unique().on(table.clueId, table.userId),
		index().on(table.clueId),
	],
);

export const cluesDifficultyVotes = pgTable(
	'cluesDifficultyVotes',
	{
		id: uuid().primaryKey().defaultRandom(),
		createdAt: timestamp().notNull().defaultNow(),
		clueId: uuid().notNull().references(() => clues.id),
		userId: uuid().notNull().references(() => users.id),
		difficulty: decimal(), // NULL = no vote, [0-1] = difficulty rating
	},
	table => [
		unique().on(table.clueId, table.userId),
		index().on(table.clueId),
	],
);

// TODO: grids?
