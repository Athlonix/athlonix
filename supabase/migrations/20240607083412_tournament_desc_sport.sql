alter table "public"."ACTIVITIES" drop constraint "public_ACTIVITIES_id_address_fkey";

alter table "public"."ACTIVITIES" drop constraint "public_ACTIVITIES_id_sport_fkey";

alter table "public"."REPORTS" add column "id_product" bigint;

alter table "public"."TOURNAMENTS" add column "description" text;

alter table "public"."TOURNAMENTS" add column "id_sport" bigint;

alter table "public"."ACTIVITIES" add constraint "ACTIVITIES_id_address_fkey" FOREIGN KEY (id_address) REFERENCES "ADDRESSES"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ACTIVITIES" validate constraint "ACTIVITIES_id_address_fkey";

alter table "public"."ACTIVITIES" add constraint "ACTIVITIES_id_sport_fkey" FOREIGN KEY (id_sport) REFERENCES "SPORTS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ACTIVITIES" validate constraint "ACTIVITIES_id_sport_fkey";

alter table "public"."REPORTS" add constraint "REPORTS_id_product_fkey" FOREIGN KEY (id_product) REFERENCES "PRODUCTS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."REPORTS" validate constraint "REPORTS_id_product_fkey";

alter table "public"."TOURNAMENTS" add constraint "TOURNAMENTS_id_sport_fkey" FOREIGN KEY (id_sport) REFERENCES "SPORTS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TOURNAMENTS" validate constraint "TOURNAMENTS_id_sport_fkey";


