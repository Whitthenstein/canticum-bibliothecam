import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const AUTHOR_TYPES = {
  COMPOSER: "Composer",
  LYRICIST: "Lyricist"
} as const;
export type AUTHOR_TYPES = (typeof AUTHOR_TYPES)[keyof typeof AUTHOR_TYPES];

export const usersTable = sqliteTable("users", {
  ID: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text("email").unique().notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date())
});

export const authorsTable = sqliteTable("authors", {
  ID: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  isComposer: integer("is_composer", { mode: "boolean" }).notNull().default(false),
  isLyricist: integer("is_lyricist", { mode: "boolean" }).notNull().default(false),
  biography: text("biography"),
  authorSearch: text("author_search").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date())
});

export const songsTable = sqliteTable("songs", {
  ID: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  lyrics: text("lyrics"),
  details: text("details"),
  pdfFile: text("pdf_file").notNull(),
  musescoreFile: text("musescore_file"),
  audioFile: text("audio_file"),
  songSearch: text("song_search").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date())
});

export const discographyTable = sqliteTable("discography", {
  ID: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  songID: text("song_id")
    .notNull()
    .references(() => songsTable.ID, { onDelete: "cascade" }),
  authorID: text("author_id")
    .notNull()
    .references(() => authorsTable.ID, { onDelete: "cascade" }),
  isMusicAuthor: integer("is_music_author", { mode: "boolean" }).notNull().default(false),
  isLyricsAuthor: integer("is_lyrics_author", { mode: "boolean" }).notNull().default(false),
  credit: text("credit"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date())
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertAuthor = typeof authorsTable.$inferInsert;
export type SelectAuthor = typeof authorsTable.$inferSelect;

export type InsertSong = typeof songsTable.$inferInsert;
export type SelectSong = typeof songsTable.$inferSelect;

export type InsertDiscographyEntry = typeof discographyTable.$inferInsert;
export type SelectDiscographyEntry = typeof discographyTable.$inferSelect;

export interface SelectAuthorOfSong {
  ID: typeof authorsTable.$inferSelect.ID;
  name: typeof authorsTable.$inferSelect.name;
  isComposer: typeof authorsTable.$inferSelect.isComposer;
  isLyricist: typeof authorsTable.$inferSelect.isLyricist;
  biography: typeof authorsTable.$inferSelect.biography;
  isMusicAuthor: typeof discographyTable.$inferSelect.isMusicAuthor;
  isLyricsAuthor: typeof discographyTable.$inferSelect.isLyricsAuthor;
  credit: typeof discographyTable.$inferSelect.credit;
}
