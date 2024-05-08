create type "public"."reaction" as enum ('like');

revoke delete on table "public"."POLLS_OPTIONS" from "anon";

revoke insert on table "public"."POLLS_OPTIONS" from "anon";

revoke references on table "public"."POLLS_OPTIONS" from "anon";

revoke select on table "public"."POLLS_OPTIONS" from "anon";

revoke trigger on table "public"."POLLS_OPTIONS" from "anon";

revoke truncate on table "public"."POLLS_OPTIONS" from "anon";

revoke update on table "public"."POLLS_OPTIONS" from "anon";

revoke delete on table "public"."POLLS_OPTIONS" from "authenticated";

revoke insert on table "public"."POLLS_OPTIONS" from "authenticated";

revoke references on table "public"."POLLS_OPTIONS" from "authenticated";

revoke select on table "public"."POLLS_OPTIONS" from "authenticated";

revoke trigger on table "public"."POLLS_OPTIONS" from "authenticated";

revoke truncate on table "public"."POLLS_OPTIONS" from "authenticated";

revoke update on table "public"."POLLS_OPTIONS" from "authenticated";

revoke delete on table "public"."POLLS_OPTIONS" from "service_role";

revoke insert on table "public"."POLLS_OPTIONS" from "service_role";

revoke references on table "public"."POLLS_OPTIONS" from "service_role";

revoke select on table "public"."POLLS_OPTIONS" from "service_role";

revoke trigger on table "public"."POLLS_OPTIONS" from "service_role";

revoke truncate on table "public"."POLLS_OPTIONS" from "service_role";

revoke update on table "public"."POLLS_OPTIONS" from "service_role";

revoke delete on table "public"."POLLS_VOTES" from "anon";

revoke insert on table "public"."POLLS_VOTES" from "anon";

revoke references on table "public"."POLLS_VOTES" from "anon";

revoke select on table "public"."POLLS_VOTES" from "anon";

revoke trigger on table "public"."POLLS_VOTES" from "anon";

revoke truncate on table "public"."POLLS_VOTES" from "anon";

revoke update on table "public"."POLLS_VOTES" from "anon";

revoke delete on table "public"."POLLS_VOTES" from "authenticated";

revoke insert on table "public"."POLLS_VOTES" from "authenticated";

revoke references on table "public"."POLLS_VOTES" from "authenticated";

revoke select on table "public"."POLLS_VOTES" from "authenticated";

revoke trigger on table "public"."POLLS_VOTES" from "authenticated";

revoke truncate on table "public"."POLLS_VOTES" from "authenticated";

revoke update on table "public"."POLLS_VOTES" from "authenticated";

revoke delete on table "public"."POLLS_VOTES" from "service_role";

revoke insert on table "public"."POLLS_VOTES" from "service_role";

revoke references on table "public"."POLLS_VOTES" from "service_role";

revoke select on table "public"."POLLS_VOTES" from "service_role";

revoke trigger on table "public"."POLLS_VOTES" from "service_role";

revoke truncate on table "public"."POLLS_VOTES" from "service_role";

revoke update on table "public"."POLLS_VOTES" from "service_role";

revoke delete on table "public"."USERS_VOTES" from "anon";

revoke insert on table "public"."USERS_VOTES" from "anon";

revoke references on table "public"."USERS_VOTES" from "anon";

revoke select on table "public"."USERS_VOTES" from "anon";

revoke trigger on table "public"."USERS_VOTES" from "anon";

revoke truncate on table "public"."USERS_VOTES" from "anon";

revoke update on table "public"."USERS_VOTES" from "anon";

revoke delete on table "public"."USERS_VOTES" from "authenticated";

revoke insert on table "public"."USERS_VOTES" from "authenticated";

revoke references on table "public"."USERS_VOTES" from "authenticated";

revoke select on table "public"."USERS_VOTES" from "authenticated";

revoke trigger on table "public"."USERS_VOTES" from "authenticated";

revoke truncate on table "public"."USERS_VOTES" from "authenticated";

revoke update on table "public"."USERS_VOTES" from "authenticated";

revoke delete on table "public"."USERS_VOTES" from "service_role";

revoke insert on table "public"."USERS_VOTES" from "service_role";

revoke references on table "public"."USERS_VOTES" from "service_role";

revoke select on table "public"."USERS_VOTES" from "service_role";

revoke trigger on table "public"."USERS_VOTES" from "service_role";

revoke truncate on table "public"."USERS_VOTES" from "service_role";

revoke update on table "public"."USERS_VOTES" from "service_role";

alter table "public"."POLLS" drop constraint "public_POLLS_id_user_fkey";

alter table "public"."POLLS_OPTIONS" drop constraint "public_POLLS_OPTIONS_id_poll_fkey";

alter table "public"."POLLS_VOTES" drop constraint "public_POLLS_VOTES_id_option_fkey";

alter table "public"."POLLS_VOTES" drop constraint "public_POLLS_VOTES_id_poll_fkey";

alter table "public"."USERS_VOTES" drop constraint "public_USERS_VOTES_id_poll_fkey";

alter table "public"."COMMENTS" drop constraint "comments_id_comment_fkey";

alter table "public"."POLLS_OPTIONS" drop constraint "POLLS_ANSWERS_pkey";

alter table "public"."POLLS_VOTES" drop constraint "POLLS_VOTES_pkey";

alter table "public"."USERS_VOTES" drop constraint "USERS_VOTES_pkey";

drop index if exists "public"."POLLS_VOTES_pkey";

drop index if exists "public"."USERS_VOTES_pkey";

drop index if exists "public"."POLLS_ANSWERS_pkey";

drop table "public"."POLLS_OPTIONS";

drop table "public"."POLLS_VOTES";

drop table "public"."USERS_VOTES";

create table "public"."POLLS_ANSWERS" (
    "id" bigint generated by default as identity not null,
    "answer" text not null,
    "id_poll" bigint not null
);


create table "public"."POSTS_CATEGORIES" (
    "id_post" integer not null,
    "id_category" bigint not null,
    "id" integer generated by default as identity not null
);


create table "public"."POSTS_VIEWS" (
    "viewed_at" timestamp with time zone not null default now(),
    "id_user" integer not null,
    "id_post" integer not null
);


alter table "public"."COMMENTS" drop column "id_response";

alter table "public"."COMMENTS" add column "id_parent" integer;

alter table "public"."POLLS" drop column "description";

alter table "public"."POLLS" drop column "end_at";

alter table "public"."POLLS" drop column "id_user";

alter table "public"."POLLS" drop column "max_choices";

alter table "public"."POLLS" drop column "start_at";

alter table "public"."POLLS" add column "content" text;

alter table "public"."POSTS" add column "description" text;

alter table "public"."POSTS_REACTIONS" drop column "like";

alter table "public"."POSTS_REACTIONS" alter column "reaction" set default 'like'::reaction;

alter table "public"."POSTS_REACTIONS" alter column "reaction" set not null;

alter table "public"."POSTS_REACTIONS" alter column "reaction" set data type reaction using "reaction"::reaction;

alter table "public"."USERS" drop column "deleted_at";

CREATE UNIQUE INDEX "POSTS_CATEGORIES_id_key" ON public."POSTS_CATEGORIES" USING btree (id);

CREATE UNIQUE INDEX "POSTS_CATEGORIES_pkey" ON public."POSTS_CATEGORIES" USING btree (id);

CREATE UNIQUE INDEX "POSTS_VIEWS_pkey" ON public."POSTS_VIEWS" USING btree (id_user, id_post);

CREATE UNIQUE INDEX "POLLS_ANSWERS_pkey" ON public."POLLS_ANSWERS" USING btree (id);

alter table "public"."POLLS_ANSWERS" add constraint "POLLS_ANSWERS_pkey" PRIMARY KEY using index "POLLS_ANSWERS_pkey";

alter table "public"."POSTS_CATEGORIES" add constraint "POSTS_CATEGORIES_pkey" PRIMARY KEY using index "POSTS_CATEGORIES_pkey";

alter table "public"."POSTS_VIEWS" add constraint "POSTS_VIEWS_pkey" PRIMARY KEY using index "POSTS_VIEWS_pkey";

alter table "public"."POLLS_ANSWERS" add constraint "public_POLLS_ANSWERS_id_poll_fkey" FOREIGN KEY (id_poll) REFERENCES "POLLS"(id) not valid;

alter table "public"."POLLS_ANSWERS" validate constraint "public_POLLS_ANSWERS_id_poll_fkey";

alter table "public"."POSTS_CATEGORIES" add constraint "POSTS_CATEGORIES_id_key" UNIQUE using index "POSTS_CATEGORIES_id_key";

alter table "public"."POSTS_CATEGORIES" add constraint "public_POST_CATEGORIES_category_id_fkey" FOREIGN KEY (id_category) REFERENCES "CATEGORIES"(id) not valid;

alter table "public"."POSTS_CATEGORIES" validate constraint "public_POST_CATEGORIES_category_id_fkey";

alter table "public"."POSTS_CATEGORIES" add constraint "public_POST_CATEGORIES_post_id_fkey" FOREIGN KEY (id_post) REFERENCES "POSTS"(id) not valid;

alter table "public"."POSTS_CATEGORIES" validate constraint "public_POST_CATEGORIES_post_id_fkey";

alter table "public"."POSTS_VIEWS" add constraint "public_POSTS_VIEWS_id_post_fkey" FOREIGN KEY (id_post) REFERENCES "POSTS"(id) not valid;

alter table "public"."POSTS_VIEWS" validate constraint "public_POSTS_VIEWS_id_post_fkey";

alter table "public"."POSTS_VIEWS" add constraint "public_POSTS_VIEWS_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) not valid;

alter table "public"."POSTS_VIEWS" validate constraint "public_POSTS_VIEWS_id_user_fkey";

alter table "public"."COMMENTS" add constraint "comments_id_comment_fkey" FOREIGN KEY (id_parent) REFERENCES "COMMENTS"(id) not valid;

alter table "public"."COMMENTS" validate constraint "comments_id_comment_fkey";

grant delete on table "public"."POLLS_ANSWERS" to "anon";

grant insert on table "public"."POLLS_ANSWERS" to "anon";

grant references on table "public"."POLLS_ANSWERS" to "anon";

grant select on table "public"."POLLS_ANSWERS" to "anon";

grant trigger on table "public"."POLLS_ANSWERS" to "anon";

grant truncate on table "public"."POLLS_ANSWERS" to "anon";

grant update on table "public"."POLLS_ANSWERS" to "anon";

grant delete on table "public"."POLLS_ANSWERS" to "authenticated";

grant insert on table "public"."POLLS_ANSWERS" to "authenticated";

grant references on table "public"."POLLS_ANSWERS" to "authenticated";

grant select on table "public"."POLLS_ANSWERS" to "authenticated";

grant trigger on table "public"."POLLS_ANSWERS" to "authenticated";

grant truncate on table "public"."POLLS_ANSWERS" to "authenticated";

grant update on table "public"."POLLS_ANSWERS" to "authenticated";

grant delete on table "public"."POLLS_ANSWERS" to "service_role";

grant insert on table "public"."POLLS_ANSWERS" to "service_role";

grant references on table "public"."POLLS_ANSWERS" to "service_role";

grant select on table "public"."POLLS_ANSWERS" to "service_role";

grant trigger on table "public"."POLLS_ANSWERS" to "service_role";

grant truncate on table "public"."POLLS_ANSWERS" to "service_role";

grant update on table "public"."POLLS_ANSWERS" to "service_role";

grant delete on table "public"."POSTS_CATEGORIES" to "anon";

grant insert on table "public"."POSTS_CATEGORIES" to "anon";

grant references on table "public"."POSTS_CATEGORIES" to "anon";

grant select on table "public"."POSTS_CATEGORIES" to "anon";

grant trigger on table "public"."POSTS_CATEGORIES" to "anon";

grant truncate on table "public"."POSTS_CATEGORIES" to "anon";

grant update on table "public"."POSTS_CATEGORIES" to "anon";

grant delete on table "public"."POSTS_CATEGORIES" to "authenticated";

grant insert on table "public"."POSTS_CATEGORIES" to "authenticated";

grant references on table "public"."POSTS_CATEGORIES" to "authenticated";

grant select on table "public"."POSTS_CATEGORIES" to "authenticated";

grant trigger on table "public"."POSTS_CATEGORIES" to "authenticated";

grant truncate on table "public"."POSTS_CATEGORIES" to "authenticated";

grant update on table "public"."POSTS_CATEGORIES" to "authenticated";

grant delete on table "public"."POSTS_CATEGORIES" to "service_role";

grant insert on table "public"."POSTS_CATEGORIES" to "service_role";

grant references on table "public"."POSTS_CATEGORIES" to "service_role";

grant select on table "public"."POSTS_CATEGORIES" to "service_role";

grant trigger on table "public"."POSTS_CATEGORIES" to "service_role";

grant truncate on table "public"."POSTS_CATEGORIES" to "service_role";

grant update on table "public"."POSTS_CATEGORIES" to "service_role";

grant delete on table "public"."POSTS_VIEWS" to "anon";

grant insert on table "public"."POSTS_VIEWS" to "anon";

grant references on table "public"."POSTS_VIEWS" to "anon";

grant select on table "public"."POSTS_VIEWS" to "anon";

grant trigger on table "public"."POSTS_VIEWS" to "anon";

grant truncate on table "public"."POSTS_VIEWS" to "anon";

grant update on table "public"."POSTS_VIEWS" to "anon";

grant delete on table "public"."POSTS_VIEWS" to "authenticated";

grant insert on table "public"."POSTS_VIEWS" to "authenticated";

grant references on table "public"."POSTS_VIEWS" to "authenticated";

grant select on table "public"."POSTS_VIEWS" to "authenticated";

grant trigger on table "public"."POSTS_VIEWS" to "authenticated";

grant truncate on table "public"."POSTS_VIEWS" to "authenticated";

grant update on table "public"."POSTS_VIEWS" to "authenticated";

grant delete on table "public"."POSTS_VIEWS" to "service_role";

grant insert on table "public"."POSTS_VIEWS" to "service_role";

grant references on table "public"."POSTS_VIEWS" to "service_role";

grant select on table "public"."POSTS_VIEWS" to "service_role";

grant trigger on table "public"."POSTS_VIEWS" to "service_role";

grant truncate on table "public"."POSTS_VIEWS" to "service_role";

grant update on table "public"."POSTS_VIEWS" to "service_role";


