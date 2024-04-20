alter table "public"."USERS" add column "created_at" timestamp with time zone not null;

create type "public"."days" as enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

create type "public"."recurrence" as enum ('weekly', 'monthly', 'annual');

alter table "public"."ACTIVITIES" drop column "duration_minute";

alter table "public"."ACTIVITIES" add column "days" days[] not null;

alter table "public"."ACTIVITIES" add column "end_date" timestamp with time zone not null;

alter table "public"."ACTIVITIES" add column "interval" smallint not null default '1'::smallint;

alter table "public"."ACTIVITIES" add column "min_participants" integer not null;

alter table "public"."ACTIVITIES" add column "recurrence" recurrence not null;

alter table "public"."ACTIVITIES" add column "start_date" timestamp with time zone not null;

alter table "public"."ACTIVITIES_USERS" add column "active" boolean not null default false;

alter table "public"."SPORTS" add column "description" text;

alter table "public"."SPORTS" add column "image" text;

alter table "public"."SPORTS" add column "max_players" integer;

alter table "public"."SPORTS" add column "min_players" integer not null default 1;
