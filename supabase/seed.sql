INSERT INTO "public"."ROLES" ("id", "name") 
VALUES 
  (1, 'BANNED'), 
  (2, 'MEMBER'), 
  (3, 'REDACTOR'), 
  (4, 'MODERATOR'), 
  (5, 'ADMIN'), 
  (6, 'PRESIDENT'), 
  (7, 'SECRATARY'), 
  (8, 'TREASURER'),
  (9, 'VICE_PRESIDENT'), 
  (10, 'EMPLOYEE'),
  (11, 'COMMUNICATION_OFFICER'),
  (12, 'PROJECT_MANAGER');
  

INSERT INTO "public"."REASONS" ("reason")
VALUES
  ('Spam'),
  ('Insultes ou harcèlement'),
  ('Informations mensongères ou glorification de la violence'),
  ('Divulgation d''informations privé permettant d''identifier une personne'),
  ('Autre raison');



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

INSERT INTO public."ACTIVITIES_USERS" (id_activity, created_at, id_user, active, date)
VALUES (1, '2022-01-01 08:00:00', 1, true, '2022-12-31'),
       (2, '2022-01-02 09:00:00', 2, true, '2022-12-30'),
       (3, '2022-01-03 10:00:00', 3, true, '2022-12-29'),
       (4, '2022-01-04 11:00:00', 4, true, '2022-12-28'),
       (5, '2022-01-05 12:00:00', 5, true, '2022-12-27');

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

INSERT INTO public."DONATIONS" (id_user, created_at, amount, receipt_url) VALUES
	(NULL, '2024-05-21 12:13:45.941762+00', 5, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KO2dsrIGMgYWwdEaIh06LBY9KnwdMAfjo7yW9iRtO9rVKUdwEFuDXoLkvVImgJWUpreyMpPu0yjp7YFC'),
	(NULL, '2024-05-21 13:09:43.148662+00', 5, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KO2dsrIGMgYWwdEaIh06LBY9KnwdMAfjo7yW9iRtO9rVKUdwEFuDXoLkvVImgJWUpreyMpPu0yjp7YFC'),
	(NULL, '2024-05-21 20:33:28.977528+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJeKtLIGMgb5vdn45do6LBaL5L8epx2_ocdGMTAL1lhAztGnpGimYhrdCKvYIxdngjtenYKMnYkm6bll?s=ap'),
	(NULL, '2024-05-22 13:42:22.266016+00', 30, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KLzst7IGMgZFM3VqNPU6LBbxxMuBImsRziLMZkuhjG8zS-_8sA__6JWGBKeH2XzlndHiRmSXNyG4185x'),
	(NULL, '2024-05-22 13:44:07.870885+00', 30, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKbtt7IGMgalNtPeCUg6LBbfAjmuDPrUMnjzKXd2TELDR7xAf7f4ewPlBG8XrBESkiF9Gr9cw5qXTnl_'),
	(NULL, '2024-05-22 13:45:11.959078+00', 20, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KObtt7IGMgYFN4YNeg06LBbidnIpaUYCPIA3wQ3ERipmdDRxpuKJj0rEm4aq7OifMNcYqKOVTmcWc7vS?s=ap'),
	(NULL, '2024-05-22 13:45:54.133011+00', 30, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJHut7IGMga2Oddu6Q86LBZ6UGSs14xhjhJR1NxdQEtf2hTmhd4cqjEqmb3EQWYxLNJzK8AukDnyNLUA'),
	(NULL, '2024-05-22 13:46:13.611919+00', 30, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKTut7IGMgZqfoVo8Jo6LBZRdFvANzaE0Yc7R1pjr6uBSj1zB5EtpAE0ZjgpVgt2qmbzakSuTTlFHKPB'),
	(NULL, '2024-05-22 13:46:40.457886+00', 30, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KL_ut7IGMgbykpJ6Hus6LBZ6M3Wgs-xC9wPFgs8c_VyopppMv5Ol-wdaWr81ifGaPD_kVdsZCSTFLTuC'),
	(NULL, '2024-05-22 13:57:41.457857+00', 15, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KNTzt7IGMgZRmYu_RIM6LBZG6lfBqFN6xqb4PMNuUbsNzCauYQNslq1_E5D11wVcZjWjUSHOpsDMUlpA?s=ap'),
	(NULL, '2024-05-22 13:58:27.76377+00', 15, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KIL0t7IGMgYg2hN2cbU6LBYnaUkIkv-aJVdEmgt4ajM9CpuBsFRB7caa6mTbmZuQ0RJq4_I_YuakHeEo?s=ap'),
	(NULL, '2024-05-22 14:04:40.303678+00', 15, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KPf2t7IGMgZ8TFkKRCs6LBae69MPqOl9eUTmd_iWhgSJ5FPuRlMbBkQXq1NV89It5klJ9fh0AKMxVC8J?s=ap'),
	(NULL, '2024-05-22 14:05:12.978052+00', 15, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJj3t7IGMgYZjC4H1vo6LBbUdgqV5YA_3dC1eySAS_O39RjdqNjZsz7je6JFEhZemkf-EhTmWEZHDVRD?s=ap'),
	(NULL, '2024-05-22 14:50:09.445369+00', 15, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKCMuLIGMgbBJurQmg46LBa9x7r7-OvVbEDOL3-HTkG5D-vQ5WjFN1DJwQlocpS1nipCgK-mhU4kQFyF?s=ap'),
	(NULL, '2024-05-22 14:50:35.245285+00', 15, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KLqMuLIGMgZZ99iXhxo6LBZk8Bljv7cK9wmpnaKAC4SS5_gI0iB7yZuaDSuovyxTDg9pN6BF3ytYuxJL?s=ap'),
	(NULL, '2024-05-22 14:56:51.119391+00', 15, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KLGPuLIGMgaiJF1PQ9A6LBZEDY4WhZIi3m6H3hm_VTygAyW8ioCDVsfHWy0V9ONpta2F7I1ItXr_33vg?s=ap'),
	(NULL, '2024-05-22 14:56:56.573659+00', 15, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KLePuLIGMgbcr-d59N06LBb5KzdQmR3qF3sEXEsWMuGBcRcUuI5ripUnWnWKYYqM8GK4qneZd85zK0It?s=ap'),
	(NULL, '2024-06-02 13:09:38.015914+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJHe8bIGMgYCZOta46U6LBZxJId3YhdJGt_gxjrvGoYWZ4ucZ759xKHyd6d1hI-8Y7mN7LG673itgKmt?s=ap'),
	(NULL, '2024-06-02 13:17:17.575878+00', 5, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KNzh8bIGMgY1w7uOB0w6LBbroQm_BzQmgp5MIX5cElBPHvvdryBZPKPxJm5lGggLBF8YlVFqN2GcRqt0'),
	(NULL, '2024-06-02 13:30:25.036274+00', 20, 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KPDn8bIGMgYgY48pGAU6LBaxHMSdHa609rfiJOnA9-tPlGR9uWhpjPJDuJ1H_SyFEuFj0md4JtaRBoXL'),
	(NULL, '2024-06-02 13:31:59.69499+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KM7o8bIGMgbwCniDmsQ6LBYOkfyc1cAoAomAlbEMOKtDv_XGH2qRi1_6o6ljFMhCrermh_r_L-Fh7Lru?s=ap'),
	(NULL, '2024-06-02 13:32:32.566479+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KO_o8bIGMgZVf0KcECw6LBZlgpiXQIafF4ubyK4d_B6vbEgS4_p2K80LDo8vdvpHDpEzrwJbHkCRblal?s=ap'),
	(NULL, '2024-06-02 13:35:06.817267+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KInq8bIGMgZ8q0QtvJw6LBZQmvAolXZ_19navgMdn6LrQ0bWbufV0gtpofL6PvaYg6jZypV-i9Skp76Y?s=ap'),
	(NULL, '2024-06-02 13:36:06.991771+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KMbq8bIGMgYB_FvlvxQ6LBb-rs80BJyMjMb2-kI1lGqBVfuX3ynqqC_Mr2cdmRTMNdSc0HoX_54sw9KR?s=ap'),
	(NULL, '2024-06-02 13:37:29.745975+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJnr8bIGMgb3e7gESY06LBadAxCOgOYtSNjGMKAtdC8AnMAkUHIuRzbR-zrQmfeXxO8actgrzKKc27eb?s=ap'),
	(NULL, '2024-06-02 13:47:25.608253+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KOzv8bIGMgaADWEF4r46LBbTdMaL-TsYzCQZSut_zpRyZKZ7SEYXkZ03QgS8fxseIOcy9VHLldbH_fIs?s=ap'),
	(NULL, '2024-06-02 13:51:40.544965+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KOvx8bIGMgYqMkeMGZc6LBaGMeDXSt_OSTr2-D4xI1qyij_z_LhJsfGi44x4JZnngpKULeyb6tZIo9LR?s=ap'),
	(NULL, '2024-06-02 13:54:02.148341+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KPny8bIGMgY5cqBwric6LBbDdvRHdevNLvf2DsbASIs92ZJRirmbpQ72r7UphG1pM1Vwh65T8JGzQX72?s=ap'),
	(NULL, '2024-06-02 14:00:29.419815+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KPz18bIGMgYMMBzwR086LBaZIr7RlYCgsbQRwYVDhMjqz_yp7jtIBnwjGlSlw3ZVR8hWysPFlAirEE4k?s=ap'),
	(NULL, '2024-06-02 14:02:39.866417+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KP_28bIGMgZlm6ga2cw6LBYoyhQr8uA9BM1OnEwtEZW0dUOVaG3ybgD6aYXMlh-t7sTHuwMlBO9JfWfG?s=ap'),
	(NULL, '2024-06-02 15:13:46.611231+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKmY8rIGMgZs9iuBO5c6LBYjMNqkAWFvRM87GMRkpqg0efxotIrKHGnxpP7zHre0TNkuxzVtTnPlyYsj?s=ap'),
	(NULL, '2024-06-02 15:18:39.454571+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KM6a8rIGMgarRfCXedA6LBaGM7CwwSK8ASoNgVEr10ttFH3hz2GfCqiXlF2ZB5Yklrs7W6vMNy0GuEdH?s=ap'),
	(NULL, '2024-06-02 15:19:33.138995+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KISb8rIGMgb8jq6hlRc6LBYR7XdA3xWH7WXI2M_2WeBrEAxx9pMu4RsSFecY6k2zERD7TNGEqxQVgvYh?s=ap'),
	(NULL, '2024-06-02 15:20:13.080219+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKyb8rIGMgYggmTtVcg6LBbHgMbyn3MOrn71WHEq4RA5W6O9vGYBzGju-ZZtaPiE4kmDCfNbifDnVOer?s=ap'),
	(NULL, '2024-06-02 15:22:06.563787+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJ2c8rIGMgZt0TMqIiQ6LBbQTxrnmy0gf30UrvFGxW1K543xHqB8NLIRHJiRfX7PWImKZ2OanFMaS5FY?s=ap'),
	(NULL, '2024-06-02 15:24:21.581665+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKSd8rIGMgZ9bqqZ-bY6LBbBDmmyqSOMJPqlM15hRdH6rW2JxTERe5bGOXBRr2Kgm0rhG8iJiU8YsMWR?s=ap'),
	(NULL, '2024-06-02 15:28:19.535574+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJKf8rIGMgb0cghyfF46LBbBrsBiUvrZJrmvcP1oIZkII6NMjK5PYwHRdFsv13TF7u96FZBCFP0SQ0zU?s=ap'),
	(NULL, '2024-06-02 15:30:20.307775+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KIug8rIGMgYEX5X_8Sg6LBaq1Oa35lSk2TtWvjMiPfAvJYZFSLF-wMdoR-6mRIVPj4bgRi7TITy9WGu9?s=ap'),
	(NULL, '2024-06-02 15:31:18.498471+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KMWg8rIGMgYvcO9Fo_U6LBZnsfWWjqbBnzUaBcvUFm3LHeyDnuZcQ5NyoQrJJR_QC6GANLhx62SRTjtU?s=ap'),
	(NULL, '2024-06-02 15:35:14.566447+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KLGi8rIGMgY_mDA9SsQ6LBYnr6zvV1axDtfuWMsAJQBafJmqlWbZjaWc4gUzmNPCmIGktfB2XfMvKUYG?s=ap'),
	(NULL, '2024-06-02 15:36:08.467875+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KOei8rIGMgZrQScLKR46LBbCDhv152dVXgCZm0YnyqVUuB65PysDRODy77UOFI0aZgdPJX1EptAslO-F?s=ap'),
	(NULL, '2024-06-02 15:37:42.686028+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KMWj8rIGMgbh3n_luCk6LBY3_8rUXUwyytPrJLo9Zk1UogHdjKLhs3iDmO2mM2iU90jn-WIxwIWI0-3w?s=ap'),
	(NULL, '2024-06-02 15:39:00.425114+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJOk8rIGMgZosDjDRmY6LBZvhvXVVcObrZDd7FsGIjWwe1GXeCTiv5VxoWjzcgrHK5zRBEQTz-a7DHPf?s=ap'),
	(NULL, '2024-06-02 15:41:15.800707+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJql8rIGMgawBD82Zpw6LBbfssB6xPnauTUCvW1Dp7RwLu044GXDJ8fAxiKcq7nWg0MxVFj0824g_5AI?s=ap'),
	(NULL,'2024-06-02 16:20:21.486347+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KMS38rIGMgZs7Q2LdC06LBY_HFcwJh8GUlKaFfT13qXdB362lZ6BTh5XZJoxh87L2ah67493MH8gMuBF?s=ap');
