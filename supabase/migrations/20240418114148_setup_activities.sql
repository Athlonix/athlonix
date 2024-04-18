alter table "public"."USERS_ROLES" drop constraint "public_USERS_ROLES_id_role_fkey";

alter table "public"."USERS_ROLES" drop constraint "public_USERS_ROLES_id_user_fkey";

alter table "public"."ACTIVITIES" add column "id_address" bigint;

alter table "public"."ACTIVITIES" add constraint "public_ACTIVITIES_id_address_fkey" FOREIGN KEY (id_address) REFERENCES "ADDRESSES"(id) not valid;

alter table "public"."ACTIVITIES" validate constraint "public_ACTIVITIES_id_address_fkey";

alter table "public"."USERS_ROLES" add constraint "public_USERS_ROLES_id_role_fkey" FOREIGN KEY (id_role) REFERENCES "ROLES"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."USERS_ROLES" validate constraint "public_USERS_ROLES_id_role_fkey";

alter table "public"."USERS_ROLES" add constraint "public_USERS_ROLES_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."USERS_ROLES" validate constraint "public_USERS_ROLES_id_user_fkey";
