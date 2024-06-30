alter table "public"."ACTIVITIES" alter column "frequency" set not null;

alter table "public"."ACTIVITIES_USERS" add column "date" date not null;


