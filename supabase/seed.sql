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
('admin@gmail.com', 'admin', 'Admin', 'Admin', NOW()),
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

INSERT INTO "public"."POLLS" ("id", "title", "description", "end_at", "id_user", "max_choices", "start_at", "assembly") VALUES
	(1, 'vote 1', 'description', '2024-07-02 17:40:39.258+00', 1, 1, '2024-06-02 17:40:39.258+00', NULL),
	(2, 'vote 2', 'description', '2024-07-02 17:40:39.258+00', 1, 1, '2024-06-02 17:40:39.258+00', NULL),
	(4, 'vote 3', 'description', '2024-07-02 17:40:39.258+00', 1, 1, '2024-06-02 17:40:39.258+00', NULL),
	(6, 'vote 4', 'description', '2024-07-02 17:40:39.258+00', 1, 1, '2022-05-02 17:40:39+00', NULL),
	(5, 'vote 5', 'description', '2023-06-04 17:40:39+00', 1, 1, '2024-06-02 17:40:39.258+00', NULL),
	(3, 'vote 6', 'description', '2026-10-14 17:40:39+00', 1, 1, '2025-08-09 17:40:39+00', NULL);


INSERT INTO "public"."POLLS_OPTIONS" ("id", "content", "id_poll") VALUES
	(1, 'choix 1', 1),
	(2, 'choix 2', 1),
	(3, 'choix 1', 2),
	(4, 'choix 2', 2),
	(5, 'choix 1', 3),
	(6, 'choix 2', 3),
	(7, 'choix 1', 4),
	(8, 'choix 2', 4),
	(9, 'choix 1', 5),
	(10, 'choix 2', 5),
	(11, 'choix 1', 6),
	(12, 'choix 2', 6);
