alter type "public"."frequency" rename to "frequency__old_version_to_be_dropped";

create type "public"."frequency" as enum ('weekly', 'monthly', 'yearly', 'unique');

alter table "public"."ACTIVITIES" alter column frequency type "public"."frequency" using frequency::text::"public"."frequency";

drop type "public"."frequency__old_version_to_be_dropped";


