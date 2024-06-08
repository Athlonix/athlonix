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

INSERT INTO "public"."POLLS" ("title", "description", "end_at", "id_user", "max_choices", "start_at", "assembly") VALUES
  ('vote 1', 'description', '2024-07-02 17:40:39.258+00', 1, 1, '2024-06-17 00:00:00.258+00', NULL),
  ('vote 2', 'description', '2024-07-02 17:40:39.258+00', 1, 1, '2024-07-02 12:40:39.258+00', NULL),
  ('vote 3', 'description', '2024-07-02 17:40:39.258+00', 1, 1, '2024-06-22 00:00:39.258+00', NULL),
  ('vote 4', 'description', '2024-07-02 17:40:39.258+00', 1, 1, '2022-05-02 08:40:00.258+00', NULL),
  ('vote 5', 'description', '2023-06-04 17:40:39+00', 1, 1, '2024-06-02 00:00:00+00', NULL),
  ('vote 6', 'description', '2026-10-14 17:40:39+00', 1, 1, '2025-08-09 17:40:39+00', NULL);

INSERT INTO "public"."POLLS_OPTIONS" ("content", "id_poll") VALUES
  ('choice 1', 1),
  ('choice 2', 1),
  ('choice 1', 2),
  ('choice 2', 2),
  ('choice 1', 3),
  ('choice 2', 3),
  ('choice 1', 4),
  ('choice 2', 4),
  ('choice 1', 5),
  ('choice 2', 5),
  ('choice 1', 6),
  ('choice 2', 6);

INSERT INTO
  public."ADDRESSES" (
    road,
    postal_code,
    complement,
    city,
    number,
    NAME,
    id_lease
  )
VALUES
  (
    'Fauboug Saint-Antoine',
    '75012',
    '',
    'Paris',
    67,
    'Nation 1',
    NULL
  ),
  (
    'Rue de la République',
    '13001',
    '',
    'Marseille',
    12,
    'Nation 2',
    NULL
  ),
  (
    'Rue de la République',
    '33000',
    '',
    'Bordeaux',
    23,
    'Nation 3',
    NULL
  ),
  (
    'Rue de la République',
    '69001',
    '',
    'Lyon',
    34,
    'Nation 4',
    NULL
  ),
  (
    'Rue de la République',
    '59000',
    '',
    'Lille',
    45,
    'Nation 5',
    NULL
  );

INSERT INTO public."SPORTS" (name, description, image, max_players, min_players) VALUES
	('Basketball', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon dans un panier.', 'https://wkpdfodfnkbdvyjuuttd.supabase.co/storage/v1/object/public/image/sports/foot.jpg', 10, 2),
	('Football', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon dans un but.', 'https://wkpdfodfnkbdvyjuuttd.supabase.co/storage/v1/object/public/image/sports/foot.jpg', 22, 7),
	('Tennis', 'Un sport de raquette où les joueurs marquent des points en frappant une balle dans le terrain adverse.', 'https://wkpdfodfnkbdvyjuuttd.supabase.co/storage/v1/object/public/image/sports/foot.jpg', 4, 2),
	('Ping-pong', 'Un sport de raquette où les joueurs marquent des points en frappant une balle sur une table.', 'https://wkpdfodfnkbdvyjuuttd.supabase.co/storage/v1/object/public/image/sports/foot.jpg', 4, 2),
	('Volleyball', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon par-dessus un filet.', 'https://wkpdfodfnkbdvyjuuttd.supabase.co/storage/v1/object/public/image/sports/foot.jpg', 12, 2);

INSERT INTO public."ACTIVITIES" (max_participants, name, id_sport, id_address, end_date, description, min_participants, start_date, end_time, frequency, days_of_week, start_time)
VALUES (10, 'Activity 1', 1, 1, '2022-12-31', 'Description 1', 5, '2022-01-01', '18:00:00', 'weekly', ARRAY['monday', 'tuesday']::days[], '09:00:00'),
       (15, 'Activity 2', 2, 2, '2022-12-30', 'Description 2', 8, '2022-01-02', '19:00:00', 'monthly', ARRAY['tuesday']::days[], '10:00:00'),
       (20, 'Activity 3', 3, 3, '2022-12-29', 'Description 3', 10, '2022-01-03', '20:00:00', 'daily', ARRAY['wednesday']::days[], '11:00:00'),
       (25, 'Activity 4', 4, 4, '2022-12-28', 'Description 4', 12, '2022-01-04', '21:00:00', 'weekly', ARRAY['thursday']::days[], '12:00:00'),
       (30, 'Activity 5', 5, 5, '2022-12-27', 'Description 5', 15, '2022-01-05', '22:00:00', 'yearly', ARRAY['friday']::days[], '13:00:00');

INSERT INTO public."ACTIVITIES_EXCEPTIONS" (id_activity, min_participants, max_participants, date)
VALUES (1, 5, 10, '2022-01-01'),
       (2, 8, 15, '2022-01-02'),
       (3, 10, 20, '2022-01-03'),
       (4, 12, 25, '2022-01-04'),
       (5, 15, 30, '2022-01-05');

INSERT INTO public."ACTIVITIES_TASKS" (created_at, priority, description, title, status, id_employee, id_activity_exception, id_activity)
VALUES ('2022-01-01 08:00:00', 'P0', 'Task 1', 'Task 1 Title', 'completed', 1, 1, 1),
       ('2022-01-02 09:00:00', 'P1', 'Task 2', 'Task 2 Title', 'completed', 2, 2, 2),
       ('2022-01-03 10:00:00', 'P3', 'Task 3', 'Task 3 Title', 'in progress', 3, 3, 3),
       ('2022-01-04 11:00:00', 'P0', 'Task 4', 'Task 4 Title', 'in progress', 4, 4, 4),
       ('2022-01-05 12:00:00', 'P2', 'Task 5', 'Task 5 Title', 'not started', 5, 5, 5);

INSERT INTO public."ACTIVITIES_USERS" (id_activity, created_at, id_user, active)
VALUES (1, '2022-01-01 08:00:00', 1, true),
       (2, '2022-01-02 09:00:00', 2, true),
       (3, '2022-01-03 10:00:00', 3, true),
       (4, '2022-01-04 11:00:00', 4, true),
       (5, '2022-01-05 12:00:00', 5, true);

INSERT INTO public."ACTIVITY_TEAMS" (id_activity, id_user)
VALUES (1, 1),
       (2, 2),
       (3, 3),
       (4, 4),
       (5, 5);

INSERT INTO
  public."TOURNAMENTS" (
    created_at,
    default_match_length,
    NAME,
    max_participants,
    team_capacity,
    rules,
    prize,
    id_address
  )
VALUES
  (
    '2022-06-01 08:00:00',
    60,
    'Tournament 1',
    20,
    5,
    'Rules 1',
    'Prize 1',
    1
  ),
  (
    '2022-08-02 09:00:00',
    45,
    'Tournament 2',
    25,
    6,
    'Rules 2',
    'Prize 2',
    2
  ),
  (
    '2022-08-03 10:00:00',
    30,
    'Tournament 3',
    30,
    7,
    'Rules 3',
    'Prize 3',
    3
  ),
  (
    '2022-07-04 11:00:00',
    75,
    'Tournament 4',
    35,
    8,
    'Rules 4',
    'Prize 4',
    4
  ),
  (
    '2022-08-07 12:00:00',
    90,
    'Tournament 5',
    40,
    9,
    'Rules 5',
    'Prize 5',
    5
  );

INSERT INTO
  public."POSTS" (
    CONTENT,
    title,
    created_at,
    id_user,
    cover_image,
    description
  )
VALUES
  (
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'First Post',
    CURRENT_TIMESTAMP,
    1,
    'image1.jpg',
    'This is the first post.'
  );

INSERT INTO
  public."POSTS" (
    CONTENT,
    title,
    created_at,
    id_user,
    cover_image,
    description
  )
VALUES
  (
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Second Post',
    CURRENT_TIMESTAMP,
    2,
    'image2.jpg',
    'This is the second post.'
  );

INSERT INTO
  public."COMMENTS" (
    CONTENT,
    id_response,
    id_post,
    created_at,
    id_activity,
    id_user
  )
VALUES
  (
    'Great post!',
    NULL,
    1,
    CURRENT_TIMESTAMP,
    NULL,
    3
  );

INSERT INTO
  public."COMMENTS" (
    CONTENT,
    id_response,
    id_post,
    created_at,
    id_activity,
    id_user
  )
VALUES
  (
    'Nice post!',
    1,
    1,
    CURRENT_TIMESTAMP,
    NULL,
    4
  );
