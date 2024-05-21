create table "public"."ACTIVITY_TEAM" (
    "id_activity" bigint not null,
    "id_user" integer not null
);


alter table "public"."ACTIVITY_TEAM" enable row level security;

alter table "public"."MATERIALS" add column "weight_grams" real;

CREATE UNIQUE INDEX "ACTIVITY_TEAM_pkey" ON public."ACTIVITY_TEAM" USING btree (id_activity, id_user);

alter table "public"."ACTIVITY_TEAM" add constraint "ACTIVITY_TEAM_pkey" PRIMARY KEY using index "ACTIVITY_TEAM_pkey";

alter table "public"."ACTIVITY_TEAM" add constraint "ACTIVITY_TEAM_id_activity_fkey" FOREIGN KEY (id_activity) REFERENCES "ACTIVITIES"(id) not valid;

alter table "public"."ACTIVITY_TEAM" validate constraint "ACTIVITY_TEAM_id_activity_fkey";

alter table "public"."ACTIVITY_TEAM" add constraint "ACTIVITY_TEAM_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) not valid;

alter table "public"."ACTIVITY_TEAM" validate constraint "ACTIVITY_TEAM_id_user_fkey";

grant delete on table "public"."ACTIVITY_TEAM" to "anon";

grant insert on table "public"."ACTIVITY_TEAM" to "anon";

grant references on table "public"."ACTIVITY_TEAM" to "anon";

grant select on table "public"."ACTIVITY_TEAM" to "anon";

grant trigger on table "public"."ACTIVITY_TEAM" to "anon";

grant truncate on table "public"."ACTIVITY_TEAM" to "anon";

grant update on table "public"."ACTIVITY_TEAM" to "anon";

grant delete on table "public"."ACTIVITY_TEAM" to "authenticated";

grant insert on table "public"."ACTIVITY_TEAM" to "authenticated";

grant references on table "public"."ACTIVITY_TEAM" to "authenticated";

grant select on table "public"."ACTIVITY_TEAM" to "authenticated";

grant trigger on table "public"."ACTIVITY_TEAM" to "authenticated";

grant truncate on table "public"."ACTIVITY_TEAM" to "authenticated";

grant update on table "public"."ACTIVITY_TEAM" to "authenticated";

grant delete on table "public"."ACTIVITY_TEAM" to "service_role";

grant insert on table "public"."ACTIVITY_TEAM" to "service_role";

grant references on table "public"."ACTIVITY_TEAM" to "service_role";

grant select on table "public"."ACTIVITY_TEAM" to "service_role";

grant trigger on table "public"."ACTIVITY_TEAM" to "service_role";

grant truncate on table "public"."ACTIVITY_TEAM" to "service_role";

grant update on table "public"."ACTIVITY_TEAM" to "service_role";


