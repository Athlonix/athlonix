revoke delete on table "public"."ACTIVITY_TEAM" from "anon";

revoke insert on table "public"."ACTIVITY_TEAM" from "anon";

revoke references on table "public"."ACTIVITY_TEAM" from "anon";

revoke select on table "public"."ACTIVITY_TEAM" from "anon";

revoke trigger on table "public"."ACTIVITY_TEAM" from "anon";

revoke truncate on table "public"."ACTIVITY_TEAM" from "anon";

revoke update on table "public"."ACTIVITY_TEAM" from "anon";

revoke delete on table "public"."ACTIVITY_TEAM" from "authenticated";

revoke insert on table "public"."ACTIVITY_TEAM" from "authenticated";

revoke references on table "public"."ACTIVITY_TEAM" from "authenticated";

revoke select on table "public"."ACTIVITY_TEAM" from "authenticated";

revoke trigger on table "public"."ACTIVITY_TEAM" from "authenticated";

revoke truncate on table "public"."ACTIVITY_TEAM" from "authenticated";

revoke update on table "public"."ACTIVITY_TEAM" from "authenticated";

revoke delete on table "public"."ACTIVITY_TEAM" from "service_role";

revoke insert on table "public"."ACTIVITY_TEAM" from "service_role";

revoke references on table "public"."ACTIVITY_TEAM" from "service_role";

revoke select on table "public"."ACTIVITY_TEAM" from "service_role";

revoke trigger on table "public"."ACTIVITY_TEAM" from "service_role";

revoke truncate on table "public"."ACTIVITY_TEAM" from "service_role";

revoke update on table "public"."ACTIVITY_TEAM" from "service_role";

alter table "public"."ACTIVITY_TEAM" drop constraint "ACTIVITY_TEAM_id_activity_fkey";

alter table "public"."ACTIVITY_TEAM" drop constraint "ACTIVITY_TEAM_id_user_fkey";

alter table "public"."ACTIVITY_TEAM" drop constraint "ACTIVITY_TEAM_pkey";

drop index if exists "public"."ACTIVITY_TEAM_pkey";

drop table "public"."ACTIVITY_TEAM";

create table "public"."ACTIVITY_TEAMS" (
    "id_activity" bigint not null,
    "id_user" integer not null
);


alter table "public"."ACTIVITY_TEAMS" enable row level security;

CREATE UNIQUE INDEX "ACTIVITY_TEAMS_pkey" ON public."ACTIVITY_TEAMS" USING btree (id_activity, id_user);

alter table "public"."ACTIVITY_TEAMS" add constraint "ACTIVITY_TEAMS_pkey" PRIMARY KEY using index "ACTIVITY_TEAMS_pkey";

alter table "public"."ACTIVITY_TEAMS" add constraint "ACTIVITY_TEAM_id_activity_fkey" FOREIGN KEY (id_activity) REFERENCES "ACTIVITIES"(id) not valid;

alter table "public"."ACTIVITY_TEAMS" validate constraint "ACTIVITY_TEAM_id_activity_fkey";

alter table "public"."ACTIVITY_TEAMS" add constraint "ACTIVITY_TEAM_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) not valid;

alter table "public"."ACTIVITY_TEAMS" validate constraint "ACTIVITY_TEAM_id_user_fkey";

grant delete on table "public"."ACTIVITY_TEAMS" to "anon";

grant insert on table "public"."ACTIVITY_TEAMS" to "anon";

grant references on table "public"."ACTIVITY_TEAMS" to "anon";

grant select on table "public"."ACTIVITY_TEAMS" to "anon";

grant trigger on table "public"."ACTIVITY_TEAMS" to "anon";

grant truncate on table "public"."ACTIVITY_TEAMS" to "anon";

grant update on table "public"."ACTIVITY_TEAMS" to "anon";

grant delete on table "public"."ACTIVITY_TEAMS" to "authenticated";

grant insert on table "public"."ACTIVITY_TEAMS" to "authenticated";

grant references on table "public"."ACTIVITY_TEAMS" to "authenticated";

grant select on table "public"."ACTIVITY_TEAMS" to "authenticated";

grant trigger on table "public"."ACTIVITY_TEAMS" to "authenticated";

grant truncate on table "public"."ACTIVITY_TEAMS" to "authenticated";

grant update on table "public"."ACTIVITY_TEAMS" to "authenticated";

grant delete on table "public"."ACTIVITY_TEAMS" to "service_role";

grant insert on table "public"."ACTIVITY_TEAMS" to "service_role";

grant references on table "public"."ACTIVITY_TEAMS" to "service_role";

grant select on table "public"."ACTIVITY_TEAMS" to "service_role";

grant trigger on table "public"."ACTIVITY_TEAMS" to "service_role";

grant truncate on table "public"."ACTIVITY_TEAMS" to "service_role";

grant update on table "public"."ACTIVITY_TEAMS" to "service_role";


