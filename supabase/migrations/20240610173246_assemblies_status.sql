alter table "public"."ASSEMBLIES" add column "closed" boolean not null default false;
ALTER TABLE ONLY "public"."POLLS"
    ADD CONSTRAINT "public_POLLS_assembly_fkey" FOREIGN KEY ("assembly") REFERENCES "public"."ASSEMBLIES"("id");
