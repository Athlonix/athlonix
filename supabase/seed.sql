INSERT INTO "public"."ROLES" ("id", "name") 
VALUES 
  (1, 'BANNED'), 
  (2, 'MEMBER'), 
  (3, 'REDACTOR'), 
  (4, 'MODERATOR'), 
  (5, 'ADMIN'), 
  (6, 'DIRECTOR'), 
  (7, 'SECRATARY'), 
  (8, 'TREASURER'), 
  (9, 'PRESIDENT');

INSERT INTO "public"."REASONS" ("id", "reason")
VALUES
  (1, 'Spam'),
  (2, "Insultes ou harcèlement"),
  (3, "Informations mensongères ou glorification de la violence"),
  (4, "Divulgation d'informations privé permettant d'identifier une personne"),
  (5, "Autre raison");