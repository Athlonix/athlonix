alter table "public"."DOCUMENTS" add column "assembly" bigint;

alter table "public"."DOCUMENTS" add column "path" text not null;

alter table "public"."DOCUMENTS" alter column "description" set not null;

CREATE UNIQUE INDEX "DOCUMENTS_name_key" ON public."DOCUMENTS" USING btree (name);

alter table "public"."DOCUMENTS" add constraint "DOCUMENTS_name_key" UNIQUE using index "DOCUMENTS_name_key";

alter table "public"."DOCUMENTS" add constraint "public_DOCUMENTS_assembly_fkey" FOREIGN KEY (assembly) REFERENCES "ASSEMBLIES"(id) not valid;

alter table "public"."DOCUMENTS" validate constraint "public_DOCUMENTS_assembly_fkey";
