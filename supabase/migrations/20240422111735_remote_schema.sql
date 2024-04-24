create type "public"."reaction" as enum ('like');

alter table "public"."COMMENTS" drop constraint "comments_id_comment_fkey";

create table "public"."POST_CATEGORIES" (
    "post_id" integer not null,
    "category_id" bigint not null
);


alter table "public"."POST_CATEGORIES" enable row level security;

alter table "public"."COMMENTS" drop column "id_response";

alter table "public"."COMMENTS" add column "id_parent" integer;

alter table "public"."POSTS" add column "description" text;

alter table "public"."POSTS_REACTIONS" drop column "like";

alter table "public"."POSTS_REACTIONS" alter column "reaction" set default 'like'::reaction;

alter table "public"."POSTS_REACTIONS" alter column "reaction" set not null;

alter table "public"."POSTS_REACTIONS" alter column "reaction" set data type reaction using "reaction"::reaction;

CREATE UNIQUE INDEX "POST_CATEGORIES_pkey" ON public."POST_CATEGORIES" USING btree (post_id, category_id);

alter table "public"."POST_CATEGORIES" add constraint "POST_CATEGORIES_pkey" PRIMARY KEY using index "POST_CATEGORIES_pkey";

alter table "public"."POST_CATEGORIES" add constraint "public_POST_CATEGORIES_category_id_fkey" FOREIGN KEY (category_id) REFERENCES "CATEGORIES"(id) not valid;

alter table "public"."POST_CATEGORIES" validate constraint "public_POST_CATEGORIES_category_id_fkey";

alter table "public"."POST_CATEGORIES" add constraint "public_POST_CATEGORIES_post_id_fkey" FOREIGN KEY (post_id) REFERENCES "POSTS"(id) not valid;

alter table "public"."POST_CATEGORIES" validate constraint "public_POST_CATEGORIES_post_id_fkey";

alter table "public"."COMMENTS" add constraint "comments_id_comment_fkey" FOREIGN KEY (id_parent) REFERENCES "COMMENTS"(id) not valid;

alter table "public"."COMMENTS" validate constraint "comments_id_comment_fkey";

grant delete on table "public"."POST_CATEGORIES" to "anon";

grant insert on table "public"."POST_CATEGORIES" to "anon";

grant references on table "public"."POST_CATEGORIES" to "anon";

grant select on table "public"."POST_CATEGORIES" to "anon";

grant trigger on table "public"."POST_CATEGORIES" to "anon";

grant truncate on table "public"."POST_CATEGORIES" to "anon";

grant update on table "public"."POST_CATEGORIES" to "anon";

grant delete on table "public"."POST_CATEGORIES" to "authenticated";

grant insert on table "public"."POST_CATEGORIES" to "authenticated";

grant references on table "public"."POST_CATEGORIES" to "authenticated";

grant select on table "public"."POST_CATEGORIES" to "authenticated";

grant trigger on table "public"."POST_CATEGORIES" to "authenticated";

grant truncate on table "public"."POST_CATEGORIES" to "authenticated";

grant update on table "public"."POST_CATEGORIES" to "authenticated";

grant delete on table "public"."POST_CATEGORIES" to "service_role";

grant insert on table "public"."POST_CATEGORIES" to "service_role";

grant references on table "public"."POST_CATEGORIES" to "service_role";

grant select on table "public"."POST_CATEGORIES" to "service_role";

grant trigger on table "public"."POST_CATEGORIES" to "service_role";

grant truncate on table "public"."POST_CATEGORIES" to "service_role";

grant update on table "public"."POST_CATEGORIES" to "service_role";


