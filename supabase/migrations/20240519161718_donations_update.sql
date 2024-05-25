alter table "public"."DONATIONS" drop column "money";

alter table "public"."DONATIONS" add column "amount" bigint not null;

alter table "public"."DONATIONS" add column "receipt_url" text not null;

alter table "public"."DONATIONS" alter column "id_user" drop not null;
