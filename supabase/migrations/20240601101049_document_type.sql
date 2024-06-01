alter table "public"."DOCUMENTS" add column "type" text not null;

alter table "public"."DOCUMENTS" add column "updated_at" timestamp with time zone default now() not null;
