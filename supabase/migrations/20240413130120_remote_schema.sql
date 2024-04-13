alter table "public"."POSTS" drop constraint "public_POSTS_user_id_fkey";

alter table "public"."POSTS" drop column "user_id";

alter table "public"."POSTS" add column "id_user" integer not null;

alter table "public"."POSTS" add constraint "public_POSTS_user_id_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) not valid;

alter table "public"."POSTS" validate constraint "public_POSTS_user_id_fkey";


