alter table "public"."COMMENTS" add column "id_user" integer not null;

alter table "public"."COMMENTS" alter column "id_post" drop not null;

alter table "public"."USERS" add column "id_auth" uuid;

alter table "public"."USERS" alter column "id_referer" drop not null;

alter table "public"."USERS" alter column "id_role" set not null;

CREATE UNIQUE INDEX "USERS_id_auth_key" ON public."USERS" USING btree (id_auth);

alter table "public"."COMMENTS" add constraint "public_COMMENTS_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) not valid;

alter table "public"."COMMENTS" validate constraint "public_COMMENTS_id_user_fkey";

alter table "public"."USERS" add constraint "USERS_id_auth_key" UNIQUE using index "USERS_id_auth_key";

alter table "public"."USERS" add constraint "public_USERS_id_auth_fkey" FOREIGN KEY (id_auth) REFERENCES auth.users(id) not valid;

alter table "public"."USERS" validate constraint "public_USERS_id_auth_fkey";
