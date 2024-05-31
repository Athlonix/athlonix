alter table "public"."ADDRESSES_MATERIALS" drop constraint "public_ADDRESSES_MATERIALS_id_address_fkey";

alter table "public"."ADDRESSES_MATERIALS" drop constraint "public_ADDRESSES_MATERIALS_id_material_fkey";

alter table "public"."TEAMS_MATCHES" alter column "winner" set default false;

CREATE UNIQUE INDEX "MATERIALS_name_key" ON public."MATERIALS" USING btree (name);

alter table "public"."ADDRESSES_MATERIALS" add constraint "ADDRESSES_MATERIALS_id_address_fkey" FOREIGN KEY (id_address) REFERENCES "ADDRESSES"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ADDRESSES_MATERIALS" validate constraint "ADDRESSES_MATERIALS_id_address_fkey";

alter table "public"."ADDRESSES_MATERIALS" add constraint "ADDRESSES_MATERIALS_id_material_fkey" FOREIGN KEY (id_material) REFERENCES "MATERIALS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ADDRESSES_MATERIALS" validate constraint "ADDRESSES_MATERIALS_id_material_fkey";

alter table "public"."MATERIALS" add constraint "MATERIALS_name_key" UNIQUE using index "MATERIALS_name_key";


