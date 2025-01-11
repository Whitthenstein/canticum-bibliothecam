PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_authors` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_composer` integer DEFAULT false NOT NULL,
	`is_lyricist` integer DEFAULT false NOT NULL,
	`biography` text,
	`author_search` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_authors`("id", "name", "is_composer", "is_lyricist", "biography", "author_search", "created_at", "updated_at") SELECT "id", "name", "is_composer", "is_lyricist", "biography", "author_search", "created_at", "updated_at" FROM `authors`;--> statement-breakpoint
DROP TABLE `authors`;--> statement-breakpoint
ALTER TABLE `__new_authors` RENAME TO `authors`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_discography` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`song_id` integer NOT NULL,
	`author_id` integer NOT NULL,
	`is_music_author` integer DEFAULT false NOT NULL,
	`is_lyrics_author` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_discography`("id", "song_id", "author_id", "is_music_author", "is_lyrics_author", "created_at", "updated_at") SELECT "id", "song_id", "author_id", "is_music_author", "is_lyrics_author", "created_at", "updated_at" FROM `discography`;--> statement-breakpoint
DROP TABLE `discography`;--> statement-breakpoint
ALTER TABLE `__new_discography` RENAME TO `discography`;--> statement-breakpoint
CREATE TABLE `__new_songs` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`lyrics` text,
	`details` text,
	`pdf_file` text NOT NULL,
	`musescore_file` text,
	`audio_file` text,
	`song_search` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_songs`("id", "title", "subtitle", "lyrics", "details", "pdf_file", "musescore_file", "audio_file", "song_search", "created_at", "updated_at") SELECT "id", "title", "subtitle", "lyrics", "details", "pdf_file", "musescore_file", "audio_file", "song_search", "created_at", "updated_at" FROM `songs`;--> statement-breakpoint
DROP TABLE `songs`;--> statement-breakpoint
ALTER TABLE `__new_songs` RENAME TO `songs`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`is_admin` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "is_admin", "created_at", "updated_at") SELECT "id", "email", "is_admin", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);