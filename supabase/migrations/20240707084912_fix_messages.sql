alter table "public"."MESSAGES" drop constraint "public_MESSAGES_id_receiver_fkey";

alter table "public"."MESSAGES" drop column "id_receiver";

alter table "public"."MESSAGES" drop column "mesage";

alter table "public"."MESSAGES" add column "message" text not null;
