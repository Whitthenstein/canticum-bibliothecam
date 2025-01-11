PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_discography` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
PRAGMA foreign_keys=ON;