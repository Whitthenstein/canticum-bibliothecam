ALTER TABLE `authors` ADD `is_composer` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `authors` ADD `is_lyricist` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `authors` DROP COLUMN `author_type`;