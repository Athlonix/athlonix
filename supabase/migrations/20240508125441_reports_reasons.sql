create table "public"."REASONS" (
    "id" bigint generated by default as identity not null,
    "reason" text not null
);


create table "public"."REPORTS" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "id_reason" smallint not null,
    "content" text not null,
    "id_post" integer,
    "id_comment" integer
);


alter table "public"."ACTIVITIES" alter column "days" drop not null;

CREATE UNIQUE INDEX "REASONS_pkey" ON public."REASONS" USING btree (id);

CREATE UNIQUE INDEX "REPORTS_pkey" ON public."REPORTS" USING btree (id);

alter table "public"."REASONS" add constraint "REASONS_pkey" PRIMARY KEY using index "REASONS_pkey";

alter table "public"."REPORTS" add constraint "REPORTS_pkey" PRIMARY KEY using index "REPORTS_pkey";

alter table "public"."REPORTS" add constraint "REPORTS_id_comment_fkey" FOREIGN KEY (id_comment) REFERENCES "COMMENTS"(id) not valid;

alter table "public"."REPORTS" validate constraint "REPORTS_id_comment_fkey";

alter table "public"."REPORTS" add constraint "REPORTS_id_post_fkey" FOREIGN KEY (id_post) REFERENCES "POSTS"(id) not valid;

alter table "public"."REPORTS" validate constraint "REPORTS_id_post_fkey";

alter table "public"."REPORTS" add constraint "REPORTS_id_reason_fkey" FOREIGN KEY (id_reason) REFERENCES "REASONS"(id) not valid;

alter table "public"."REPORTS" validate constraint "REPORTS_id_reason_fkey";

grant delete on table "public"."REASONS" to "anon";

grant insert on table "public"."REASONS" to "anon";

grant references on table "public"."REASONS" to "anon";

grant select on table "public"."REASONS" to "anon";

grant trigger on table "public"."REASONS" to "anon";

grant truncate on table "public"."REASONS" to "anon";

grant update on table "public"."REASONS" to "anon";

grant delete on table "public"."REASONS" to "authenticated";

grant insert on table "public"."REASONS" to "authenticated";

grant references on table "public"."REASONS" to "authenticated";

grant select on table "public"."REASONS" to "authenticated";

grant trigger on table "public"."REASONS" to "authenticated";

grant truncate on table "public"."REASONS" to "authenticated";

grant update on table "public"."REASONS" to "authenticated";

grant delete on table "public"."REASONS" to "service_role";

grant insert on table "public"."REASONS" to "service_role";

grant references on table "public"."REASONS" to "service_role";

grant select on table "public"."REASONS" to "service_role";

grant trigger on table "public"."REASONS" to "service_role";

grant truncate on table "public"."REASONS" to "service_role";

grant update on table "public"."REASONS" to "service_role";

grant delete on table "public"."REPORTS" to "anon";

grant insert on table "public"."REPORTS" to "anon";

grant references on table "public"."REPORTS" to "anon";

grant select on table "public"."REPORTS" to "anon";

grant trigger on table "public"."REPORTS" to "anon";

grant truncate on table "public"."REPORTS" to "anon";

grant update on table "public"."REPORTS" to "anon";

grant delete on table "public"."REPORTS" to "authenticated";

grant insert on table "public"."REPORTS" to "authenticated";

grant references on table "public"."REPORTS" to "authenticated";

grant select on table "public"."REPORTS" to "authenticated";

grant trigger on table "public"."REPORTS" to "authenticated";

grant truncate on table "public"."REPORTS" to "authenticated";

grant update on table "public"."REPORTS" to "authenticated";

grant delete on table "public"."REPORTS" to "service_role";

grant insert on table "public"."REPORTS" to "service_role";

grant references on table "public"."REPORTS" to "service_role";

grant select on table "public"."REPORTS" to "service_role";

grant trigger on table "public"."REPORTS" to "service_role";

grant truncate on table "public"."REPORTS" to "service_role";

grant update on table "public"."REPORTS" to "service_role";


