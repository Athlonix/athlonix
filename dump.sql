SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.6 (Ubuntu 15.6-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '08435cb3-9e19-431d-a104-d8ec1ba10c0a', '{"action":"user_signedup","actor_id":"3a5c7dc6-d6c7-4a75-a1e1-c7936fefac80","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-06-01 22:12:59.969398+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ad62c58-ca52-479c-bc36-c0c3201ccd88', '{"action":"login","actor_id":"3a5c7dc6-d6c7-4a75-a1e1-c7936fefac80","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-01 22:12:59.982988+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3a969c7-60f1-4973-b116-958824bfda51', '{"action":"login","actor_id":"3a5c7dc6-d6c7-4a75-a1e1-c7936fefac80","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-01 22:13:11.122228+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bda880db-0d1c-4fcc-a65f-581825e347d8', '{"action":"login","actor_id":"3a5c7dc6-d6c7-4a75-a1e1-c7936fefac80","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-01 22:13:44.435672+00', ''),
	('00000000-0000-0000-0000-000000000000', '013ab2e8-752d-4fc4-9708-ebbc9d389d42', '{"action":"user_signedup","actor_id":"9d44845f-2523-4558-bc67-2b496cd81633","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-06-02 11:17:19.16418+00', ''),
	('00000000-0000-0000-0000-000000000000', '11d681eb-1e6f-43f5-99e5-c114bbb5190a', '{"action":"login","actor_id":"9d44845f-2523-4558-bc67-2b496cd81633","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 11:17:19.175929+00', ''),
	('00000000-0000-0000-0000-000000000000', '62074fbb-8171-4acd-baf8-f40e9452e777', '{"action":"login","actor_id":"9d44845f-2523-4558-bc67-2b496cd81633","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 11:17:26.793901+00', ''),
	('00000000-0000-0000-0000-000000000000', '62f3067d-6b0e-4746-ad90-3db128ae92e6', '{"action":"login","actor_id":"9d44845f-2523-4558-bc67-2b496cd81633","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 11:19:34.815983+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e18ea3e-6dc6-411b-bf2a-9462d0eec41e', '{"action":"login","actor_id":"9d44845f-2523-4558-bc67-2b496cd81633","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 11:21:47.193214+00', ''),
	('00000000-0000-0000-0000-000000000000', '9dc8b4ed-5046-4cd9-87ad-ea3780bcd017', '{"action":"login","actor_id":"9d44845f-2523-4558-bc67-2b496cd81633","actor_username":"antonydavid@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 11:22:05.574144+00', ''),
	('00000000-0000-0000-0000-000000000000', '1129bc27-2d2e-4a92-bf22-2f18b8d91e25', '{"action":"user_signedup","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-06-02 16:19:57.253713+00', ''),
	('00000000-0000-0000-0000-000000000000', 'daade3d6-2d52-40fa-878a-43b3a9cc64f3', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 16:19:57.262888+00', ''),
	('00000000-0000-0000-0000-000000000000', '192c5bfb-401b-42b8-a565-75d67e9e9bb5', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 16:20:01.496093+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc3e2ba8-94e4-49fd-b55e-24526a6e2e36', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 17:39:49.607266+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef330bb0-b5f6-4216-b396-14e93ccbb06b', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-02 17:40:19.305842+00', ''),
	('00000000-0000-0000-0000-000000000000', '72bc4b71-e4d9-4571-aba9-c246adafa395', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-03 21:05:53.027775+00', ''),
	('00000000-0000-0000-0000-000000000000', '947d9b91-1528-47c4-8879-4aca50f095a7', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-03 21:08:47.76106+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6f478f5-0f37-4467-adb5-4d318558059e', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-03 21:16:27.096597+00', ''),
	('00000000-0000-0000-0000-000000000000', '460959d9-e588-4dc9-a1f7-ee23fb9d4509', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 09:00:17.455472+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d72e261-ec2c-4ec6-9678-b46c5aa0b18d', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 09:20:24.485228+00', ''),
	('00000000-0000-0000-0000-000000000000', '8de2637b-e759-46f1-8bec-7f0d4648cde0', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 13:00:55.274048+00', ''),
	('00000000-0000-0000-0000-000000000000', '30911d6e-7886-4f17-8ba4-f105cc5c3083', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 14:05:50.606195+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae7d9d31-5397-4618-b760-814c36ae3b11', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 18:07:55.042908+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8e436b1-fa5f-4cc0-9e73-61b247aea435', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 18:08:59.020926+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e403a23-d49d-4bcd-ace1-d7a83c4f2702', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 18:09:31.555623+00', ''),
	('00000000-0000-0000-0000-000000000000', '166851ab-86f3-4eb2-b873-7ff8ef9583e6', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 18:15:37.622717+00', ''),
	('00000000-0000-0000-0000-000000000000', '5dd527b0-2f6d-4002-85ff-713d6c5f793a', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-06 19:40:20.266048+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e58e6544-22d7-443d-a97f-7b3df9e17f33', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-07 12:39:58.278567+00', ''),
	('00000000-0000-0000-0000-000000000000', '338c157d-cf3e-4d8a-badc-d8fb47fdd0b7', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-07 13:30:27.63152+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b779297-2391-4820-a722-e9157e4f2d80', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-07 13:32:53.617718+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd58aa9ec-4c45-47ec-b2d9-68e259b501af', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-07 13:34:14.710577+00', ''),
	('00000000-0000-0000-0000-000000000000', '57f7a390-b21e-4ef4-b53f-c9d22402ddcf', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-07 13:34:30.614313+00', ''),
	('00000000-0000-0000-0000-000000000000', '61179eeb-abdc-4828-ac5c-b833bb057f61', '{"action":"login","actor_id":"e97f507c-3322-402c-8300-b956779f12d2","actor_username":"antonydavid945@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-07 13:34:43.804227+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'e97f507c-3322-402c-8300-b956779f12d2', 'authenticated', 'authenticated', 'antonydavid945@gmail.com', '$2a$10$GttAWPqI6SBbPCTg0KSOOOt4A4TD1udKGO/zaBWMhv399MDXOBjQy', '2024-06-02 16:19:57.253944+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-06-07 13:34:43.804874+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "e97f507c-3322-402c-8300-b956779f12d2", "email": "antonydavid945@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-06-02 16:19:57.251229+00', '2024-06-07 13:34:43.806442+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('e97f507c-3322-402c-8300-b956779f12d2', 'e97f507c-3322-402c-8300-b956779f12d2', '{"sub": "e97f507c-3322-402c-8300-b956779f12d2", "email": "antonydavid945@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-06-02 16:19:57.252758+00', '2024-06-02 16:19:57.252778+00', '2024-06-02 16:19:57.252778+00', '826884f2-c139-4cde-bb29-aafdee19ff51');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('cc70ae6a-d924-41ca-b2e7-f619884af44e', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-02 16:19:57.263061+00', '2024-06-02 16:19:57.263061+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('17e3d365-586e-443a-aedb-83f45f227934', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-02 16:20:01.496511+00', '2024-06-02 16:20:01.496511+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('cae0843c-2b2f-4fd9-88f4-fd7ff8243e69', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-02 17:39:49.607752+00', '2024-06-02 17:39:49.607752+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('eb91ab57-739e-43d4-a038-5570dd961f55', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-02 17:40:19.306268+00', '2024-06-02 17:40:19.306268+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('bd63933d-09eb-439c-b080-35ea34306786', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-03 21:05:53.030526+00', '2024-06-03 21:05:53.030526+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('6debc865-4238-4b76-aed6-b09f7e91c065', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-03 21:08:47.762017+00', '2024-06-03 21:08:47.762017+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('9c1ba0d0-1853-4d45-a298-a1bb5adb248f', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-03 21:16:27.097346+00', '2024-06-03 21:16:27.097346+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('6ba756af-9879-4f83-b1e1-8c86e20b1678', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 09:00:17.45912+00', '2024-06-06 09:00:17.45912+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('853337ea-d364-4e65-aeef-95955cfe9ce5', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 09:20:24.486008+00', '2024-06-06 09:20:24.486008+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('eb30f6ac-5201-4242-ab01-0a577c12dc48', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 13:00:55.274864+00', '2024-06-06 13:00:55.274864+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('36ad9379-6666-4588-9b55-afe9d62a7d3c', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 14:05:50.606968+00', '2024-06-06 14:05:50.606968+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('bc1dc54f-de55-4e2c-bfab-9a727f8725e0', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 18:07:55.043738+00', '2024-06-06 18:07:55.043738+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('32a0c5f7-09bf-4f2b-ae41-ffb62f0a9dd0', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 18:08:59.021764+00', '2024-06-06 18:08:59.021764+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('c1bfc551-6101-4a9a-ad20-90c486c691a7', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 18:09:31.556142+00', '2024-06-06 18:09:31.556142+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('83c0990b-0a1e-4249-8d56-538ff3f3023b', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 18:15:37.62361+00', '2024-06-06 18:15:37.62361+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('61c1a074-4229-4503-82ec-9efb5d44cf7f', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 19:40:20.266964+00', '2024-06-06 19:40:20.266964+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('bf5665fa-eaca-457c-bbe3-cd24985a6ff3', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-07 12:39:58.282483+00', '2024-06-07 12:39:58.282483+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('c6d4e1bf-42e1-410a-a679-f66ddfc96cef', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-07 13:30:27.632304+00', '2024-06-07 13:30:27.632304+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('d9ed8eaf-16c9-4ee1-9087-b8ccc0ee1694', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-07 13:32:53.618807+00', '2024-06-07 13:32:53.618807+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('d9a3c4af-2b65-4b0c-9269-3deb2cd0b50f', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-07 13:34:14.712046+00', '2024-06-07 13:34:14.712046+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('e564e628-b77e-4105-83ae-1fab2e272a15', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-07 13:34:30.614793+00', '2024-06-07 13:34:30.614793+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL),
	('dbbb93a7-9441-4a59-a7d1-d40a3c9e2de4', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-07 13:34:43.804934+00', '2024-06-07 13:34:43.804934+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.228.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('cc70ae6a-d924-41ca-b2e7-f619884af44e', '2024-06-02 16:19:57.263672+00', '2024-06-02 16:19:57.263672+00', 'password', '059c0d5e-01d5-4a35-8972-2213de9178d1'),
	('17e3d365-586e-443a-aedb-83f45f227934', '2024-06-02 16:20:01.497297+00', '2024-06-02 16:20:01.497297+00', 'password', '7e0627e6-cab7-46ab-be44-80b1321a0cd6'),
	('cae0843c-2b2f-4fd9-88f4-fd7ff8243e69', '2024-06-02 17:39:49.608746+00', '2024-06-02 17:39:49.608746+00', 'password', 'dba5b8ac-e620-4651-a150-cde494c035f5'),
	('eb91ab57-739e-43d4-a038-5570dd961f55', '2024-06-02 17:40:19.307144+00', '2024-06-02 17:40:19.307144+00', 'password', '01ce7730-2672-4fa3-9fb1-42d09be9d1f0'),
	('bd63933d-09eb-439c-b080-35ea34306786', '2024-06-03 21:05:53.039754+00', '2024-06-03 21:05:53.039754+00', 'password', 'bcb49560-6069-4ab8-9f6b-4fce4355f0a7'),
	('6debc865-4238-4b76-aed6-b09f7e91c065', '2024-06-03 21:08:47.763672+00', '2024-06-03 21:08:47.763672+00', 'password', 'da039097-9df9-4cea-b42f-a956cea40d35'),
	('9c1ba0d0-1853-4d45-a298-a1bb5adb248f', '2024-06-03 21:16:27.098764+00', '2024-06-03 21:16:27.098764+00', 'password', 'ba786450-d441-4c1d-9c3d-b59a46f34f34'),
	('6ba756af-9879-4f83-b1e1-8c86e20b1678', '2024-06-06 09:00:17.467604+00', '2024-06-06 09:00:17.467604+00', 'password', 'd84555d2-b2b1-4f15-9f71-97ec2df7baf5'),
	('853337ea-d364-4e65-aeef-95955cfe9ce5', '2024-06-06 09:20:24.487474+00', '2024-06-06 09:20:24.487474+00', 'password', '2dd466eb-7acb-4d0f-88ce-7dfaa7dfe0c6'),
	('eb30f6ac-5201-4242-ab01-0a577c12dc48', '2024-06-06 13:00:55.276931+00', '2024-06-06 13:00:55.276931+00', 'password', '08f22545-ce11-4d26-8000-e73cbf19faf0'),
	('36ad9379-6666-4588-9b55-afe9d62a7d3c', '2024-06-06 14:05:50.608652+00', '2024-06-06 14:05:50.608652+00', 'password', '8ef0296d-c80f-4f86-9f45-cee7de6869f6'),
	('bc1dc54f-de55-4e2c-bfab-9a727f8725e0', '2024-06-06 18:07:55.045506+00', '2024-06-06 18:07:55.045506+00', 'password', 'c2dc4f53-727d-452d-8ef9-a0e5d9b9969a'),
	('32a0c5f7-09bf-4f2b-ae41-ffb62f0a9dd0', '2024-06-06 18:08:59.023254+00', '2024-06-06 18:08:59.023254+00', 'password', '961d4481-0363-4b5d-b7f8-2344efdf4642'),
	('c1bfc551-6101-4a9a-ad20-90c486c691a7', '2024-06-06 18:09:31.557363+00', '2024-06-06 18:09:31.557363+00', 'password', '2cb8e772-4cf3-4e52-ba9a-6407d133f818'),
	('83c0990b-0a1e-4249-8d56-538ff3f3023b', '2024-06-06 18:15:37.625158+00', '2024-06-06 18:15:37.625158+00', 'password', '653ac5b0-30e6-497a-9204-cb52dcebf171'),
	('61c1a074-4229-4503-82ec-9efb5d44cf7f', '2024-06-06 19:40:20.268443+00', '2024-06-06 19:40:20.268443+00', 'password', 'a82e6865-f83e-47e1-bb8b-02b58bc8b59b'),
	('bf5665fa-eaca-457c-bbe3-cd24985a6ff3', '2024-06-07 12:39:58.292095+00', '2024-06-07 12:39:58.292095+00', 'password', '475bec3a-1184-42ea-b0d8-0456817c6576'),
	('c6d4e1bf-42e1-410a-a679-f66ddfc96cef', '2024-06-07 13:30:27.633976+00', '2024-06-07 13:30:27.633976+00', 'password', 'd47144dc-dcb6-4172-b589-afdf5265cc7f'),
	('d9ed8eaf-16c9-4ee1-9087-b8ccc0ee1694', '2024-06-07 13:32:53.620245+00', '2024-06-07 13:32:53.620245+00', 'password', '520741fa-824f-4e96-99a1-6a8819d6a540'),
	('d9a3c4af-2b65-4b0c-9269-3deb2cd0b50f', '2024-06-07 13:34:14.714227+00', '2024-06-07 13:34:14.714227+00', 'password', 'e7b96bc4-3bc3-4112-89f7-fc4ad0c60bb1'),
	('e564e628-b77e-4105-83ae-1fab2e272a15', '2024-06-07 13:34:30.615879+00', '2024-06-07 13:34:30.615879+00', 'password', '23f34456-de58-4829-82c4-b201016c3204'),
	('dbbb93a7-9441-4a59-a7d1-d40a3c9e2de4', '2024-06-07 13:34:43.806638+00', '2024-06-07 13:34:43.806638+00', 'password', 'f40d9ca7-2f75-48a1-bdfd-e3cfcbe250fb');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 9, 'oKzRfoLFgJHb3HqRW3xTgg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-02 16:19:57.263266+00', '2024-06-02 16:19:57.263266+00', NULL, 'cc70ae6a-d924-41ca-b2e7-f619884af44e'),
	('00000000-0000-0000-0000-000000000000', 10, 'sDrVZBnpFUAzVovqzSw8Ng', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-02 16:20:01.496754+00', '2024-06-02 16:20:01.496754+00', NULL, '17e3d365-586e-443a-aedb-83f45f227934'),
	('00000000-0000-0000-0000-000000000000', 11, 'HWPlTrAbnO6GMwGQ7_gF3g', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-02 17:39:49.608161+00', '2024-06-02 17:39:49.608161+00', NULL, 'cae0843c-2b2f-4fd9-88f4-fd7ff8243e69'),
	('00000000-0000-0000-0000-000000000000', 12, 'UTfT3yovWtI8gXb7wIjtjA', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-02 17:40:19.306586+00', '2024-06-02 17:40:19.306586+00', NULL, 'eb91ab57-739e-43d4-a038-5570dd961f55'),
	('00000000-0000-0000-0000-000000000000', 13, 'cWmcjHXSd_Aq0fVRAizrrw', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-03 21:05:53.033945+00', '2024-06-03 21:05:53.033945+00', NULL, 'bd63933d-09eb-439c-b080-35ea34306786'),
	('00000000-0000-0000-0000-000000000000', 14, 'DdK0qLdFZbXEAhv6-QYE0g', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-03 21:08:47.762731+00', '2024-06-03 21:08:47.762731+00', NULL, '6debc865-4238-4b76-aed6-b09f7e91c065'),
	('00000000-0000-0000-0000-000000000000', 15, 'G2hkS8baDqQljX1IbFQ1Cg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-03 21:16:27.097837+00', '2024-06-03 21:16:27.097837+00', NULL, '9c1ba0d0-1853-4d45-a298-a1bb5adb248f'),
	('00000000-0000-0000-0000-000000000000', 16, '8oWnPV9oWKd3S1uxxgzMQg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 09:00:17.462426+00', '2024-06-06 09:00:17.462426+00', NULL, '6ba756af-9879-4f83-b1e1-8c86e20b1678'),
	('00000000-0000-0000-0000-000000000000', 17, 'x_Q41qqpU78pH7BvYHLL8A', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 09:20:24.486545+00', '2024-06-06 09:20:24.486545+00', NULL, '853337ea-d364-4e65-aeef-95955cfe9ce5'),
	('00000000-0000-0000-0000-000000000000', 18, 'GjgvCTM-AtqqHTnIP1aydA', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 13:00:55.275522+00', '2024-06-06 13:00:55.275522+00', NULL, 'eb30f6ac-5201-4242-ab01-0a577c12dc48'),
	('00000000-0000-0000-0000-000000000000', 19, 'pc68C90MkQm1L5qV0HYGhQ', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 14:05:50.60759+00', '2024-06-06 14:05:50.60759+00', NULL, '36ad9379-6666-4588-9b55-afe9d62a7d3c'),
	('00000000-0000-0000-0000-000000000000', 20, 'gPdqfELbVg9kzj4uSqatgg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 18:07:55.04446+00', '2024-06-06 18:07:55.04446+00', NULL, 'bc1dc54f-de55-4e2c-bfab-9a727f8725e0'),
	('00000000-0000-0000-0000-000000000000', 21, 'aIV2PVHpd8KkOvyxCGcAfw', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 18:08:59.02236+00', '2024-06-06 18:08:59.02236+00', NULL, '32a0c5f7-09bf-4f2b-ae41-ffb62f0a9dd0'),
	('00000000-0000-0000-0000-000000000000', 22, 'MgokQhqijeOjXkuiBTypLg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 18:09:31.556627+00', '2024-06-06 18:09:31.556627+00', NULL, 'c1bfc551-6101-4a9a-ad20-90c486c691a7'),
	('00000000-0000-0000-0000-000000000000', 23, 'w1Q7qNwBhazYQspt3uEviA', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 18:15:37.624197+00', '2024-06-06 18:15:37.624197+00', NULL, '83c0990b-0a1e-4249-8d56-538ff3f3023b'),
	('00000000-0000-0000-0000-000000000000', 24, 'xQyCYg5mPXXXTDMjn6gcGg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-06 19:40:20.267555+00', '2024-06-06 19:40:20.267555+00', NULL, '61c1a074-4229-4503-82ec-9efb5d44cf7f'),
	('00000000-0000-0000-0000-000000000000', 25, 'KzkMVVGl4mDFyIWxhacuaQ', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-07 12:39:58.286177+00', '2024-06-07 12:39:58.286177+00', NULL, 'bf5665fa-eaca-457c-bbe3-cd24985a6ff3'),
	('00000000-0000-0000-0000-000000000000', 26, 'TcdniCi_Ew3BJo-0yhGplQ', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-07 13:30:27.632951+00', '2024-06-07 13:30:27.632951+00', NULL, 'c6d4e1bf-42e1-410a-a679-f66ddfc96cef'),
	('00000000-0000-0000-0000-000000000000', 27, 'CSct4uxxBKD3lfdQO5haIA', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-07 13:32:53.619357+00', '2024-06-07 13:32:53.619357+00', NULL, 'd9ed8eaf-16c9-4ee1-9087-b8ccc0ee1694'),
	('00000000-0000-0000-0000-000000000000', 28, 'wxE9v2cjKqgGvgDY1EkMKg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-07 13:34:14.712833+00', '2024-06-07 13:34:14.712833+00', NULL, 'd9a3c4af-2b65-4b0c-9269-3deb2cd0b50f'),
	('00000000-0000-0000-0000-000000000000', 29, '6_m-1baZKTbJW_86ZFZ_Zg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-07 13:34:30.615194+00', '2024-06-07 13:34:30.615194+00', NULL, 'e564e628-b77e-4105-83ae-1fab2e272a15'),
	('00000000-0000-0000-0000-000000000000', 30, 'NhfaG2Xpndxrk0ZUN-PJMg', 'e97f507c-3322-402c-8300-b956779f12d2', false, '2024-06-07 13:34:43.80577+00', '2024-06-07 13:34:43.80577+00', NULL, 'dbbb93a7-9441-4a59-a7d1-d40a3c9e2de4');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: LANDLORD; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: LEASE; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ADDRESSES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: SPORTS; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."SPORTS" ("id", "name", "description", "image", "max_players", "min_players") VALUES
	(2, 'Basketball', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon dans un panier.', 'http://127.0.0.1:54321/storage/v1/object/public/image/foot.jpg?t=2024-06-01T16%3A23%3A00.111Z', 10, 2),
	(3, 'Football', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon dans un but.', 'http://127.0.0.1:54321/storage/v1/object/public/image/foot.jpg?t=2024-06-01T16%3A23%3A00.111Z', 22, 7),
	(5, 'Ping-pong', 'Un sport de raquette où les joueurs marquent des points en frappant une balle sur une table.', 'http://127.0.0.1:54321/storage/v1/object/public/image/foot.jpg?t=2024-06-01T16%3A23%3A00.111Z', 4, 2),
	(4, 'Tennis', 'Un sport de raquette où les joueurs marquent des points en frappant une balle dans le terrain adverse.', 'http://127.0.0.1:54321/storage/v1/object/public/image/foot.jpg?t=2024-06-01T16%3A23%3A00.111Z', 4, 2),
	(6, 'Volleyball', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon par-dessus un filet.', 'http://127.0.0.1:54321/storage/v1/object/public/image/foot.jpg?t=2024-06-01T16%3A23%3A00.111Z', 12, 2),
	(1, 'oui', 'c''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sportc''est un super sport', 'http://127.0.0.1:54321/storage/v1/object/public/image/foot.jpg?t=2024-06-01T16%3A23%3A00.111Z', 50, 5),
	(9, 'ezaezae', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon dans un panier.', '/path/to/basketball.jpg', 10, 2),
	(10, 'ezaeza', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon dans un but.', '/path/to/football.jpg', 22, 7),
	(11, 'Teneazeazeaznis', 'Un sport de raquette où les joueurs marquent des points en frappant une balle dans le terrain adverse.', '/path/to/tennis.jpg', 4, 2),
	(12, 'dsqdsqdqsd-pong', 'Un sport de raquette où les joueurs marquent des points en frappant une balle sur une table.', '/path/to/ping-pong.jpg', 4, 2),
	(13, 'Volxcsqcqscleyball', 'Un sport d''équipe où les joueurs marquent des points en lançant un ballon par-dessus un filet.', '/path/to/volleyball.jpg', 12, 2);


--
-- Data for Name: ACTIVITIES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: CATEGORIES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ACTIVITIES_CATEGORIES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ACTIVITIES_EXCEPTIONS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: USERS; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."USERS" ("id", "email", "username", "first_name", "last_name", "id_referer", "id_auth", "date_validity", "created_at", "deleted_at", "invoice", "subscription") VALUES
	(3, 'antonydavid945@gmail.com', 'antonydavid945@gmail.com', 'Antony', 'David', NULL, 'e97f507c-3322-402c-8300-b956779f12d2', '2025-06-02 18:26:54+00', '2024-06-02 16:19:57.267+00', NULL, 'https://invoice.stripe.com/i/acct_1LAFO5HrubzSNnYx/test_YWNjdF8xTEFGTzVIcnVielNObll4LF9RRGlaRkViTmtMdUhucHc2cGtDVGZ6MUhNcGEyN2VXLDEwNzg4NjQxMw02008ZyzFnzY?s=ap', 'sub_1PNH8nHrubzSNnYxi1NmAMEq');


--
-- Data for Name: ACTIVITIES_TASKS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ACTIVITIES_USERS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ACTIVITY_TEAMS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: MATERIALS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ADDRESSES_MATERIALS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: APPLICATIONS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ASSEMBLIES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ASSEMBLIES_ATTENDEES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: POSTS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: COMMENTS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: COMMENTS_REACTIONS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: DOCUMENTS; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."DOCUMENTS" ("id", "name", "description", "owner", "created_at", "isAdmin", "updated_at", "type") VALUES
	(6, 'YEYEYAZE', 'test', 3, '2024-06-06 13:27:12.959772+00', true, '2024-06-06 00:00:00+00', 'application/octet-stream'),
	(5, 'eazezae', 'zeezaezaeza', 3, '2024-06-06 13:26:08.002693+00', false, '2024-06-06 00:00:00+00', 'application/octet-stream'),
	(8, 'SPORT', '', 3, '2024-06-06 14:11:55.265587+00', false, '2024-06-06 14:11:55.265587+00', 'image/avif'),
	(7, 'INVOICE', '', 3, '2024-06-06 14:11:17.079262+00', true, '2024-06-06 00:00:00+00', 'application/octet-stream');


--
-- Data for Name: DONATIONS; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."DONATIONS" ("id", "id_user", "created_at", "amount", "receipt_url") VALUES
	(23, 3, '2024-06-02 15:41:15.098964+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJql8rIGMgawBD82Zpw6LBbfssB6xPnauTUCvW1Dp7RwLu044GXDJ8fAxiKcq7nWg0MxVFj0824g_5AI?s=ap'),
	(24, 3, '2024-06-02 16:20:20.684293+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KMS38rIGMgZs7Q2LdC06LBY_HFcwJh8GUlKaFfT13qXdB362lZ6BTh5XZJoxh87L2ah67493MH8gMuBF?s=ap'),
	(22, 3, '2024-06-02 15:38:59.850296+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJOk8rIGMgZosDjDRmY6LBZvhvXVVcObrZDd7FsGIjWwe1GXeCTiv5VxoWjzcgrHK5zRBEQTz-a7DHPf?s=ap'),
	(1, 3, '2024-01-02 14:32:31+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KO_o8bIGMgZVf0KcECw6LBZlgpiXQIafF4ubyK4d_B6vbEgS4_p2K80LDo8vdvpHDpEzrwJbHkCRblal?s=ap'),
	(3, 3, '2024-06-02 13:36:06.685457+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KMbq8bIGMgYB_FvlvxQ6LBb-rs80BJyMjMb2-kI1lGqBVfuX3ynqqC_Mr2cdmRTMNdSc0HoX_54sw9KR?s=ap'),
	(2, 3, '2024-06-02 13:35:06.125047+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KInq8bIGMgZ8q0QtvJw6LBZQmvAolXZ_19navgMdn6LrQ0bWbufV0gtpofL6PvaYg6jZypV-i9Skp76Y?s=ap'),
	(4, 3, '2024-06-02 13:37:29.37912+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJnr8bIGMgb3e7gESY06LBadAxCOgOYtSNjGMKAtdC8AnMAkUHIuRzbR-zrQmfeXxO8actgrzKKc27eb?s=ap'),
	(5, 3, '2024-06-02 13:47:24.913807+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KOzv8bIGMgaADWEF4r46LBbTdMaL-TsYzCQZSut_zpRyZKZ7SEYXkZ03QgS8fxseIOcy9VHLldbH_fIs?s=ap'),
	(7, 3, '2024-06-02 13:54:01.502955+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KPny8bIGMgY5cqBwric6LBbDdvRHdevNLvf2DsbASIs92ZJRirmbpQ72r7UphG1pM1Vwh65T8JGzQX72?s=ap'),
	(9, 3, '2024-06-02 14:02:39.260662+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KP_28bIGMgZlm6ga2cw6LBYoyhQr8uA9BM1OnEwtEZW0dUOVaG3ybgD6aYXMlh-t7sTHuwMlBO9JfWfG?s=ap'),
	(10, 3, '2024-06-02 15:13:45.954988+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKmY8rIGMgZs9iuBO5c6LBYjMNqkAWFvRM87GMRkpqg0efxotIrKHGnxpP7zHre0TNkuxzVtTnPlyYsj?s=ap'),
	(12, 3, '2024-06-02 15:19:32.602242+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KISb8rIGMgb8jq6hlRc6LBYR7XdA3xWH7WXI2M_2WeBrEAxx9pMu4RsSFecY6k2zERD7TNGEqxQVgvYh?s=ap'),
	(15, 3, '2024-06-02 15:24:20.962791+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKSd8rIGMgZ9bqqZ-bY6LBbBDmmyqSOMJPqlM15hRdH6rW2JxTERe5bGOXBRr2Kgm0rhG8iJiU8YsMWR?s=ap'),
	(17, 3, '2024-06-02 15:30:19.661365+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KIug8rIGMgYEX5X_8Sg6LBaq1Oa35lSk2TtWvjMiPfAvJYZFSLF-wMdoR-6mRIVPj4bgRi7TITy9WGu9?s=ap'),
	(18, 3, '2024-06-02 15:31:17.911044+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KMWg8rIGMgYvcO9Fo_U6LBZnsfWWjqbBnzUaBcvUFm3LHeyDnuZcQ5NyoQrJJR_QC6GANLhx62SRTjtU?s=ap'),
	(19, 3, '2024-06-02 15:35:13.939748+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KLGi8rIGMgY_mDA9SsQ6LBYnr6zvV1axDtfuWMsAJQBafJmqlWbZjaWc4gUzmNPCmIGktfB2XfMvKUYG?s=ap'),
	(20, 3, '2024-06-02 15:36:07.85271+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KOei8rIGMgZrQScLKR46LBbCDhv152dVXgCZm0YnyqVUuB65PysDRODy77UOFI0aZgdPJX1EptAslO-F?s=ap'),
	(14, 3, '2024-06-02 15:22:06.022655+00', 3223, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJ2c8rIGMgZt0TMqIiQ6LBbQTxrnmy0gf30UrvFGxW1K543xHqB8NLIRHJiRfX7PWImKZ2OanFMaS5FY?s=ap'),
	(21, 3, '2024-06-02 15:37:42.073747+00', 11, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KMWj8rIGMgbh3n_luCk6LBY3_8rUXUwyytPrJLo9Zk1UogHdjKLhs3iDmO2mM2iU90jn-WIxwIWI0-3w?s=ap'),
	(16, 3, '2024-06-02 15:28:18.875328+00', 33, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KJKf8rIGMgb0cghyfF46LBbBrsBiUvrZJrmvcP1oIZkII6NMjK5PYwHRdFsv13TF7u96FZBCFP0SQ0zU?s=ap'),
	(13, 3, '2024-06-02 15:20:13.426304+00', 44, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KKyb8rIGMgYggmTtVcg6LBbHgMbyn3MOrn71WHEq4RA5W6O9vGYBzGju-ZZtaPiE4kmDCfNbifDnVOer?s=ap'),
	(11, 3, '2024-06-23 15:18:38+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KM6a8rIGMgarRfCXedA6LBaGM7CwwSK8ASoNgVEr10ttFH3hz2GfCqiXlF2ZB5Yklrs7W6vMNy0GuEdH?s=ap'),
	(8, 3, '2024-02-02 15:00:28+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KPz18bIGMgYMMBzwR086LBaZIr7RlYCgsbQRwYVDhMjqz_yp7jtIBnwjGlSlw3ZVR8hWysPFlAirEE4k?s=ap'),
	(6, 3, '2024-04-02 13:51:39+00', 100, 'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xTEFGTzVIcnVielNObll4KOvx8bIGMgYqMkeMGZc6LBaGMeDXSt_OSTr2-D4xI1qyij_z_LhJsfGi44x4JZnngpKULeyb6tZIo9LR?s=ap');


--
-- Data for Name: EVENTS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: TOURNAMENTS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ROUNDS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: MATCHES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: MESSAGES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: NEWS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: POLLS; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."POLLS" ("id", "title", "description", "end_at", "id_user", "max_choices", "start_at", "assembly") VALUES
	(1, 'vote 1', 'je test la description', '2024-07-02 17:40:39.258+00', 3, 1, '2024-06-02 17:40:39.258+00', NULL),
	(2, 'vote 2', 'je test la description', '2024-07-02 17:40:39.258+00', 3, 1, '2024-06-02 17:40:39.258+00', NULL),
	(4, 'vote 2', 'je test la description', '2024-07-02 17:40:39.258+00', 3, 1, '2024-06-02 17:40:39.258+00', NULL),
	(6, 'vote 2', 'je test la description', '2024-07-02 17:40:39.258+00', 3, 1, '2022-05-02 17:40:39+00', NULL),
	(5, 'vote 2', 'je test la description', '2023-06-04 17:40:39+00', 3, 1, '2024-06-02 17:40:39.258+00', NULL),
	(3, 'vote 2', 'je test la description', '2026-10-14 17:40:39+00', 3, 1, '2025-08-09 17:40:39+00', NULL);


--
-- Data for Name: POLLS_OPTIONS; Type: TABLE DATA; Schema: public; Owner: postgres
--

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


--
-- Data for Name: POLLS_VOTES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: POSTS_CATEGORIES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: POSTS_REACTIONS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: POSTS_VIEWS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: PRODUCTS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: PROPOSALS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: REASONS; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."REASONS" ("id", "reason") VALUES
	(1, 'Spam'),
	(2, 'Insultes ou harcèlement'),
	(3, 'Informations mensongères ou glorification de la violence'),
	(4, 'Divulgation d''informations privé permettant d''identifier une personne'),
	(5, 'Autre raison');


--
-- Data for Name: REPORTS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: RESERVED; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ROLES; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."ROLES" ("id", "name") VALUES
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


--
-- Data for Name: TEAMS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: TEAMS_MATCHES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: USERS_ROLES; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."USERS_ROLES" ("id_user", "id_role") VALUES
	(3, 2);


--
-- Data for Name: USERS_TEAMS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: USERS_VOTES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('image', 'image', NULL, '2024-06-01 16:22:12.662146+00', '2024-06-01 16:22:12.662146+00', true, false, NULL, NULL, NULL),
	('edm', 'edm', NULL, '2024-06-06 09:40:47.394715+00', '2024-06-06 09:40:47.394715+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id") VALUES
	('f6c3ecd0-af8f-4163-b493-f83275c49c68', 'image', 'foot.jpg', NULL, '2024-06-01 16:22:47.865103+00', '2024-06-01 16:22:54.003459+00', '2024-06-01 16:22:47.865103+00', '{"eTag": "\"ffd70b8be5af133f16ce6111baf6fc5f\"", "size": 132167, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-06-01T16:22:53.998Z", "contentLength": 132167, "httpStatusCode": 200}', '46804595-61e1-4f18-93e3-fe8765435cee', NULL),
	('81b6fd2f-196a-4fb1-b2b5-257cf535c2be', 'edm', 'YEYEYAZE', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 13:27:12.935825+00', '2024-06-06 14:07:20.874055+00', '2024-06-06 13:27:12.935825+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-06-06T14:07:20.871Z", "contentLength": 0, "httpStatusCode": 200}', '230268ca-ad5d-4da4-afb9-012a99aaa3e6', 'e97f507c-3322-402c-8300-b956779f12d2'),
	('cbe58c77-3da4-4dc8-9f4d-1953a6102e81', 'edm', 'eazezae', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 13:26:07.991817+00', '2024-06-06 14:09:10.495772+00', '2024-06-06 13:26:07.991817+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-06-06T14:09:10.494Z", "contentLength": 0, "httpStatusCode": 200}', 'd3e34c37-7918-415c-be1c-46c77889a303', 'e97f507c-3322-402c-8300-b956779f12d2'),
	('84da078d-543d-4463-a895-85059019663b', 'edm', 'SPORT', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 14:11:55.252589+00', '2024-06-06 14:11:55.252589+00', '2024-06-06 14:11:55.252589+00', '{"eTag": "\"aa23a7e0cbec2031e5e71e1c485cb6b8\"", "size": 9457, "mimetype": "image/avif", "cacheControl": "max-age=3600", "lastModified": "2024-06-06T14:11:55.250Z", "contentLength": 9457, "httpStatusCode": 200}', '1e3a6170-a08e-4ac3-8a26-5a404e21f8ec', 'e97f507c-3322-402c-8300-b956779f12d2'),
	('6d07f0ea-bac2-4442-a758-8ecd29dfb25a', 'edm', 'INVOICE', 'e97f507c-3322-402c-8300-b956779f12d2', '2024-06-06 14:11:17.065781+00', '2024-06-06 14:12:51.661851+00', '2024-06-06 14:11:17.065781+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-06-06T14:12:51.658Z", "contentLength": 0, "httpStatusCode": 200}', '2d0a69dd-2175-4bea-80d3-9a06e06820b6', 'e97f507c-3322-402c-8300-b956779f12d2');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 30, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: ACTIVITIES_EXCEPTIONS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ACTIVITIES_EXCEPTIONS_id_seq"', 1, false);


--
-- Name: ACTIVITIES_TASKS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ACTIVITIES_TASKS_id_seq"', 1, false);


--
-- Name: ACTIVITIES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ACTIVITIES_id_seq"', 1, false);


--
-- Name: ADDRESSES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ADDRESSES_id_seq"', 1, false);


--
-- Name: APPLICATIONS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."APPLICATIONS_id_seq"', 1, false);


--
-- Name: ASSEMBLIES_ATTENDEES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ASSEMBLIES_ATTENDEES_id_seq"', 1, false);


--
-- Name: ASSEMBLIES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ASSEMBLIES_id_seq"', 1, false);


--
-- Name: CATEGORIES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."CATEGORIES_id_seq"', 1, false);


--
-- Name: COMMENTS_REACTIONS_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."COMMENTS_REACTIONS_id_user_seq"', 1, false);


--
-- Name: COMMENTS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."COMMENTS_id_seq"', 1, false);


--
-- Name: DOCUMENTS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."DOCUMENTS_id_seq"', 8, true);


--
-- Name: DONATIONS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."DONATIONS_id_seq"', 24, true);


--
-- Name: EVENTS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."EVENTS_id_seq"', 1, false);


--
-- Name: LANDLORD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."LANDLORD_id_seq"', 1, false);


--
-- Name: LEASE_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."LEASE_id_seq"', 1, false);


--
-- Name: MATCHES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."MATCHES_id_seq"', 1, false);


--
-- Name: MATERIALS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."MATERIALS_id_seq"', 1, false);


--
-- Name: MESSAGES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."MESSAGES_id_seq"', 1, false);


--
-- Name: NEWS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."NEWS_id_seq"', 1, false);


--
-- Name: POLLS_OPTIONS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."POLLS_OPTIONS_id_seq"', 12, true);


--
-- Name: POLLS_VOTES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."POLLS_VOTES_id_seq"', 1, false);


--
-- Name: POLLS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."POLLS_id_seq"', 6, true);


--
-- Name: POSTS_CATEGORIES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."POSTS_CATEGORIES_id_seq"', 1, false);


--
-- Name: POSTS_REACTIONS_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."POSTS_REACTIONS_id_user_seq"', 1, false);


--
-- Name: POSTS_VIEWS_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."POSTS_VIEWS_id_user_seq"', 1, false);


--
-- Name: POSTS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."POSTS_id_seq"', 1, false);


--
-- Name: PRODUCTS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."PRODUCTS_id_seq"', 1, false);


--
-- Name: PROPOSALS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."PROPOSALS_id_seq"', 1, false);


--
-- Name: REASONS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."REASONS_id_seq"', 1, false);


--
-- Name: REPORTS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."REPORTS_id_seq"', 1, false);


--
-- Name: RESERVED_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."RESERVED_id_seq"', 1, false);


--
-- Name: ROLES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ROLES_id_seq"', 1, false);


--
-- Name: ROUNDS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ROUNDS_id_seq"', 1, false);


--
-- Name: SPORTS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."SPORTS_id_seq"', 13, true);


--
-- Name: TEAMS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."TEAMS_id_seq"', 1, false);


--
-- Name: TOURNAMENTS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."TOURNAMENTS_id_seq"', 1, false);


--
-- Name: USERS_VOTES_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."USERS_VOTES_id_seq"', 1, false);


--
-- Name: USERS_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."USERS_id_seq"', 3, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
