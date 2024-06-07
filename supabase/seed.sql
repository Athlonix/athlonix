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
  (9, 'PRESIDENT'),
  (10, 'EMPLOYEE');

INSERT INTO "public"."REASONS" ("id", "reason")
VALUES
  (1, 'Spam'),
  (2, 'Insultes ou harcèlement'),
  (3, 'Informations mensongères ou glorification de la violence'),
  (4, 'Divulgation d''informations privé permettant d''identifier une personne'),
  (5, 'Autre raison');

INSERT INTO public."USERS" (email, username, first_name, last_name, created_at)
VALUES 
('john.doe@example.com', 'johndoe_employee', 'John', 'Doe', NOW()),
('jane.smith@example.com', 'janesmith_employee', 'Jane', 'Smith', NOW()),
('michael.johnson@example.com', 'michaeljohnson_employee', 'Michael', 'Johnson', NOW()),
('patricia.brown@example.com', 'patriciabrown_employee', 'Patricia', 'Brown', NOW()),
('robert.jones@example.com', 'robertjones_employee', 'Robert', 'Jones', NOW()),
('linda.garcia@example.com', 'lindagarcia_employee', 'Linda', 'Garcia', NOW()),
('william.martinez@example.com', 'williammartinez_employee', 'William', 'Martinez', NOW()),
('elizabeth.rodriguez@example.com', 'elizabethrodriguez_employee', 'Elizabeth', 'Rodriguez', NOW()),
('charles.davis@example.com', 'charlesdavis_employee', 'Charles', 'Davis', NOW()),
('barbara.lopez@example.com', 'barbaralopez_employee', 'Barbara', 'Lopez', NOW()),
('joseph.miller@example.com', 'josephmiller_employee', 'Joseph', 'Miller', NOW());

INSERT INTO public."USERS_ROLES" (id_user, id_role)
SELECT id, 10
FROM public."USERS"
WHERE username IN ('johndoe_employee', 'janesmith_employee', 'michaeljohnson_employee', 'patriciabrown_employee', 'robertjones_employee', 'lindagarcia_employee', 'williammartinez_employee', 'elizabethrodriguez_employee', 'charlesdavis_employee', 'barbaralopez_employee', 'josephmiller_employee');