alter table "public"."REPORTS" add column "id_user" bigint not null;

alter table "public"."REPORTS" add constraint "public_REPORTS_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) not valid;

alter table "public"."REPORTS" validate constraint "public_REPORTS_id_user_fkey";

alter table "public"."REPORTS" drop constraint "REPORTS_id_comment_fkey";

alter table "public"."REPORTS" drop constraint "REPORTS_id_post_fkey";

alter table "public"."REPORTS" drop constraint "REPORTS_id_reason_fkey";

alter table "public"."REPORTS" drop constraint "public_REPORTS_id_user_fkey";

alter table "public"."REPORTS" add constraint "public_REPORTS_id_comment_fkey" FOREIGN KEY (id_comment) REFERENCES "COMMENTS"(id) ON DELETE CASCADE not valid;

alter table "public"."REPORTS" validate constraint "public_REPORTS_id_comment_fkey";

alter table "public"."REPORTS" add constraint "public_REPORTS_id_post_fkey" FOREIGN KEY (id_post) REFERENCES "POSTS"(id) ON DELETE CASCADE not valid;

alter table "public"."REPORTS" validate constraint "public_REPORTS_id_post_fkey";

alter table "public"."REPORTS" add constraint "public_REPORTS_id_reason_fkey" FOREIGN KEY (id_reason) REFERENCES "REASONS"(id) ON DELETE CASCADE not valid;

alter table "public"."REPORTS" validate constraint "public_REPORTS_id_reason_fkey";

alter table "public"."REPORTS" add constraint "public_REPORTS_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "USERS"(id) ON DELETE CASCADE not valid;

alter table "public"."REPORTS" validate constraint "public_REPORTS_id_user_fkey"
