revoke delete on table "public"."TOURNAMENTS_MATCHES" from "anon";

revoke insert on table "public"."TOURNAMENTS_MATCHES" from "anon";

revoke references on table "public"."TOURNAMENTS_MATCHES" from "anon";

revoke select on table "public"."TOURNAMENTS_MATCHES" from "anon";

revoke trigger on table "public"."TOURNAMENTS_MATCHES" from "anon";

revoke truncate on table "public"."TOURNAMENTS_MATCHES" from "anon";

revoke update on table "public"."TOURNAMENTS_MATCHES" from "anon";

revoke delete on table "public"."TOURNAMENTS_MATCHES" from "authenticated";

revoke insert on table "public"."TOURNAMENTS_MATCHES" from "authenticated";

revoke references on table "public"."TOURNAMENTS_MATCHES" from "authenticated";

revoke select on table "public"."TOURNAMENTS_MATCHES" from "authenticated";

revoke trigger on table "public"."TOURNAMENTS_MATCHES" from "authenticated";

revoke truncate on table "public"."TOURNAMENTS_MATCHES" from "authenticated";

revoke update on table "public"."TOURNAMENTS_MATCHES" from "authenticated";

revoke delete on table "public"."TOURNAMENTS_MATCHES" from "service_role";

revoke insert on table "public"."TOURNAMENTS_MATCHES" from "service_role";

revoke references on table "public"."TOURNAMENTS_MATCHES" from "service_role";

revoke select on table "public"."TOURNAMENTS_MATCHES" from "service_role";

revoke trigger on table "public"."TOURNAMENTS_MATCHES" from "service_role";

revoke truncate on table "public"."TOURNAMENTS_MATCHES" from "service_role";

revoke update on table "public"."TOURNAMENTS_MATCHES" from "service_role";

alter table "public"."TEAMS" drop constraint "public_TEAMS_id_tournament_fkey";

alter table "public"."TEAMS_MATCHES" drop constraint "public_TEAMS_MATCHES_id_match_fkey";

alter table "public"."TEAMS_MATCHES" drop constraint "public_TEAMS_MATCHES_id_team_fkey";

alter table "public"."TOURNAMENTS" drop constraint "public_TOURNAMENTS_id_address_fkey";

alter table "public"."TOURNAMENTS_MATCHES" drop constraint "public_TOURNAMENTS_MATCHES_id_match_fkey";

alter table "public"."TOURNAMENTS_MATCHES" drop constraint "public_TOURNAMENTS_MATCHES_id_tournament_fkey";

alter table "public"."TOURNAMENTS_MATCHES" drop constraint "TOURNAMENTS_MATCHES_pkey";

drop index if exists "public"."TOURNAMENTS_MATCHES_pkey";

drop table "public"."TOURNAMENTS_MATCHES";

create table "public"."ROUNDS" (
    "id" bigint generated by default as identity not null,
    "name" text not null,
    "id_tournament" bigint not null,
    "order" smallint not null default '1'::smallint
);


alter table "public"."MATCHES" add column "id_round" bigint not null;

alter table "public"."POSTS" add column "deleted_at" timestamp with time zone;

CREATE UNIQUE INDEX "ROUNDS_pkey" ON public."ROUNDS" USING btree (id);

alter table "public"."ROUNDS" add constraint "ROUNDS_pkey" PRIMARY KEY using index "ROUNDS_pkey";

alter table "public"."MATCHES" add constraint "MATCHES_id_round_fkey" FOREIGN KEY (id_round) REFERENCES "ROUNDS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."MATCHES" validate constraint "MATCHES_id_round_fkey";

alter table "public"."ROUNDS" add constraint "ROUNDS_id_tournament_fkey" FOREIGN KEY (id_tournament) REFERENCES "TOURNAMENTS"(id) not valid;

alter table "public"."ROUNDS" validate constraint "ROUNDS_id_tournament_fkey";

alter table "public"."TEAMS" add constraint "TEAMS_id_tournament_fkey" FOREIGN KEY (id_tournament) REFERENCES "TOURNAMENTS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TEAMS" validate constraint "TEAMS_id_tournament_fkey";

alter table "public"."TEAMS_MATCHES" add constraint "TEAMS_MATCHES_id_match_fkey" FOREIGN KEY (id_match) REFERENCES "MATCHES"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TEAMS_MATCHES" validate constraint "TEAMS_MATCHES_id_match_fkey";

alter table "public"."TEAMS_MATCHES" add constraint "TEAMS_MATCHES_id_team_fkey" FOREIGN KEY (id_team) REFERENCES "TEAMS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TEAMS_MATCHES" validate constraint "TEAMS_MATCHES_id_team_fkey";

alter table "public"."TOURNAMENTS" add constraint "TOURNAMENTS_id_address_fkey" FOREIGN KEY (id_address) REFERENCES "TOURNAMENTS"(id) not valid;

alter table "public"."TOURNAMENTS" validate constraint "TOURNAMENTS_id_address_fkey";

grant delete on table "public"."ROUNDS" to "anon";

grant insert on table "public"."ROUNDS" to "anon";

grant references on table "public"."ROUNDS" to "anon";

grant select on table "public"."ROUNDS" to "anon";

grant trigger on table "public"."ROUNDS" to "anon";

grant truncate on table "public"."ROUNDS" to "anon";

grant update on table "public"."ROUNDS" to "anon";

grant delete on table "public"."ROUNDS" to "authenticated";

grant insert on table "public"."ROUNDS" to "authenticated";

grant references on table "public"."ROUNDS" to "authenticated";

grant select on table "public"."ROUNDS" to "authenticated";

grant trigger on table "public"."ROUNDS" to "authenticated";

grant truncate on table "public"."ROUNDS" to "authenticated";

grant update on table "public"."ROUNDS" to "authenticated";

grant delete on table "public"."ROUNDS" to "service_role";

grant insert on table "public"."ROUNDS" to "service_role";

grant references on table "public"."ROUNDS" to "service_role";

grant select on table "public"."ROUNDS" to "service_role";

grant trigger on table "public"."ROUNDS" to "service_role";

grant truncate on table "public"."ROUNDS" to "service_role";

grant update on table "public"."ROUNDS" to "service_role";


