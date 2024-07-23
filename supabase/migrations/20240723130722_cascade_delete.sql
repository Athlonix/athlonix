alter table "public"."ADDRESSES" drop constraint "public_ADDRESS_id_lease_fkey";

alter table "public"."USERS_TEAMS" drop constraint "public_USERS_TEAMS_id_team_fkey";

alter table "public"."USERS_TEAMS" drop constraint "public_USERS_TEAMS_id_user_fkey";

alter table "public"."ROUNDS" drop constraint "ROUNDS_id_tournament_fkey";

alter table "public"."TOURNAMENTS" drop constraint "TOURNAMENTS_id_address_fkey";

alter table "public"."ADDRESSES" add constraint "ADDRESSES_id_lease_fkey" FOREIGN KEY (id_lease) REFERENCES "LEASE"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ADDRESSES" validate constraint "ADDRESSES_id_lease_fkey";

alter table "public"."USERS_TEAMS" add constraint "USERS_TEAMS_id_team_fkey" FOREIGN KEY (id_team) REFERENCES "TEAMS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."USERS_TEAMS" validate constraint "USERS_TEAMS_id_team_fkey";

alter table "public"."USERS_TEAMS" add constraint "USERS_TEAMS_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."USERS_TEAMS" validate constraint "USERS_TEAMS_id_user_fkey";

alter table "public"."ROUNDS" add constraint "ROUNDS_id_tournament_fkey" FOREIGN KEY (id_tournament) REFERENCES "TOURNAMENTS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ROUNDS" validate constraint "ROUNDS_id_tournament_fkey";

alter table "public"."TOURNAMENTS" add constraint "TOURNAMENTS_id_address_fkey" FOREIGN KEY (id_address) REFERENCES "ADDRESSES"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TOURNAMENTS" validate constraint "TOURNAMENTS_id_address_fkey";


