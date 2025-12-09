import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users
export const users = sqliteTable("users", {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	username: text("username").notNull().unique(),
	password_hash: text("password_hash").notNull(),
	role: text("role").default('user'), // 'user', 'admin'
	totp_secret: text("totp_secret"),
	is_banned: integer("is_banned", { mode: 'boolean' }).default(false),
	created_at: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Sessions (Optional/JWT in use) but good for invalidation if needed
export const sessions = sqliteTable("sessions", {
	id: text('id').primaryKey(),
	user_id: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
	expires_at: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// Banned Items (Blacklist)
export const banned_items = sqliteTable("banned_items", {
	id: integer('id').primaryKey({ autoIncrement: true }),
	type: text('type').notNull(), // 'url' or 'domain'
	value: text('value').notNull(),
	reason: text('reason'),
	created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

// Links
export const links = sqliteTable("links", {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	user_id: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
	slug: text("slug").notNull().unique(),
	original_url: text("original_url").notNull(),
	title: text("title"),
	is_active: integer("is_active", { mode: 'boolean' }).notNull().default(true),
	views: integer("views").notNull().default(0), // Keeping aggregate here for quick access if needed, but primary tracking in link_visits
	expires_at: text("expires_at"),
	deleted_at: text("deleted_at"),
	created_at: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Link Visits
export const link_visits = sqliteTable("link_visits", {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	link_id: text("link_id").notNull().references(() => links.id, { onDelete: 'cascade' }),
	created_at: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),

	// Analytics
	country: text('country'),
	region: text('region'),
	city: text('city'),
	device: text('device'),
	os: text('os'),
	browser: text('browser'),
	referrer: text('referrer')
});