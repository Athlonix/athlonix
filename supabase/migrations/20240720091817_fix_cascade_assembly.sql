alter table "public"."ASSEMBLIES_ATTENDEES" drop constraint "ASSEMBLIES_ATTENDEES_id_assembly_fkey";

alter table "public"."ASSEMBLIES_ATTENDEES" drop constraint "ASSEMBLIES_ATTENDEES_id_member_fkey";

alter table "public"."ASSEMBLIES_ATTENDEES" add constraint "ASSEMBLIES_ATTENDEES_id_assembly_fkey" FOREIGN KEY (id_assembly) REFERENCES "ASSEMBLIES"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ASSEMBLIES_ATTENDEES" validate constraint "ASSEMBLIES_ATTENDEES_id_assembly_fkey";

alter table "public"."ASSEMBLIES_ATTENDEES" add constraint "ASSEMBLIES_ATTENDEES_id_member_fkey" FOREIGN KEY (id_member) REFERENCES "USERS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ASSEMBLIES_ATTENDEES" validate constraint "ASSEMBLIES_ATTENDEES_id_member_fkey";
