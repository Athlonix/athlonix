alter table "public"."ASSEMBLIES" add column "code" text;

CREATE UNIQUE INDEX "ASSEMBLIES_code_key" ON public."ASSEMBLIES" USING btree (code);

alter table "public"."ASSEMBLIES" add constraint "ASSEMBLIES_code_key" UNIQUE using index "ASSEMBLIES_code_key";
