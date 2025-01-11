DROP INDEX IF EXISTS "users_email_unique";--> statement-breakpoint
ALTER TABLE `songs` ALTER COLUMN "title" TO "title" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `songs` ADD `subtitle` text;