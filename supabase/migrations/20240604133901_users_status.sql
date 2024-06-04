create type "public"."subscription status" as enum ('applied', 'approved', 'rejected');

alter table "public"."USERS" add column "status" "subscription status";


