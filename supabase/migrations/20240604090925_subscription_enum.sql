create type "public"."subscription status" as enum ('applied', 'approved', 'rejected');

alter table "public"."USERS" alter column "subscription" set data type "subscription status" using "subscription"::"subscription status";


