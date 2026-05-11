CREATE TABLE "clues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"author" uuid NOT NULL,
	"authorName" text NOT NULL,
	"content" text NOT NULL,
	"answer" text NOT NULL,
	"hints" jsonb,
	"notes" text,
	"nsfw" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"clueOfTheDay" date
);
--> statement-breakpoint
CREATE TABLE "cluesDifficultyVotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"clueId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"difficulty" numeric,
	CONSTRAINT "cluesDifficultyVotes_clueId_userId_unique" UNIQUE("clueId","userId")
);
--> statement-breakpoint
CREATE TABLE "cluesQualityVotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"clueId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"like" boolean,
	CONSTRAINT "cluesQualityVotes_clueId_userId_unique" UNIQUE("clueId","userId")
);
--> statement-breakpoint
CREATE TABLE "solves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"clueId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"time" integer,
	"hints" integer,
	CONSTRAINT "solves_clueId_userId_unique" UNIQUE("clueId","userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastLogin" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"admin" boolean DEFAULT false NOT NULL,
	"banned" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_author_users_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cluesDifficultyVotes" ADD CONSTRAINT "cluesDifficultyVotes_clueId_clues_id_fk" FOREIGN KEY ("clueId") REFERENCES "public"."clues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cluesDifficultyVotes" ADD CONSTRAINT "cluesDifficultyVotes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cluesQualityVotes" ADD CONSTRAINT "cluesQualityVotes_clueId_clues_id_fk" FOREIGN KEY ("clueId") REFERENCES "public"."clues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cluesQualityVotes" ADD CONSTRAINT "cluesQualityVotes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solves" ADD CONSTRAINT "solves_clueId_clues_id_fk" FOREIGN KEY ("clueId") REFERENCES "public"."clues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solves" ADD CONSTRAINT "solves_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clues_author_index" ON "clues" USING btree ("author");--> statement-breakpoint
CREATE INDEX "clues_createdAt_index" ON "clues" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "clues_featured_index" ON "clues" USING btree ("featured");--> statement-breakpoint
CREATE UNIQUE INDEX "clues_clueOfTheDay_index" ON "clues" USING btree ("clueOfTheDay");--> statement-breakpoint
CREATE INDEX "cluesDifficultyVotes_clueId_index" ON "cluesDifficultyVotes" USING btree ("clueId");--> statement-breakpoint
CREATE INDEX "cluesQualityVotes_clueId_index" ON "cluesQualityVotes" USING btree ("clueId");--> statement-breakpoint
CREATE INDEX "solves_userId_index" ON "solves" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "solves_clueId_index" ON "solves" USING btree ("clueId");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_index" ON "users" USING btree ("email");