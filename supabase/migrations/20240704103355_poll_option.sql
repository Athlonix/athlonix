alter table "public"."POLLS_OPTIONS" add column "id_original" bigint;

alter table "public"."POLLS_OPTIONS" alter column "content" drop not null;

alter table "public"."POLLS_OPTIONS" add constraint "POLLS_OPTIONS_id_original_fkey" FOREIGN KEY (id_original) REFERENCES "POLLS_OPTIONS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."POLLS_OPTIONS" validate constraint "POLLS_OPTIONS_id_original_fkey";


