create type "public"."majorities" as enum ('simple', 'absolute', 'two-third', 'unanimous');

alter table "public"."POLLS" add column "end_condition" majorities not null default 'simple'::majorities;

alter table "public"."POLLS" add column "keep" smallint not null default '2'::smallint;

alter table "public"."POLLS" add column "parent_poll" bigint;

alter table "public"."POLLS" add column "round" smallint not null default '1'::smallint;

alter table "public"."POLLS" add constraint "POLLS_parent_poll_fkey" FOREIGN KEY (parent_poll) REFERENCES "POLLS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."POLLS" validate constraint "POLLS_parent_poll_fkey";


