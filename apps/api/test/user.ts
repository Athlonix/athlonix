import { Hono } from 'hono';
import { createAdmin, createTestUser, deleteAdmin, loginAdmin } from './utils.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;
let id_user: number;
let id_auth: string;

const app = new Hono();

describe('User tests', () => {
  beforeAll(async () => {
    await createAdmin(app);
    const res = await createTestUser(app);
    id_user = res.id;
    id_auth = res.id_auth;
    await loginAdmin(app);
  });

  test('GET user /users/{id}', async () => {
    const res = await app.request(`${path}/users/${id_user}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);
  });

  test('GET user /users/{id} with wrong id', async () => {
    const res = await app.request(`${path}/users/0`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(404);
  });

  test('PATCH user /users/{id}', async () => {
    const res = await app.request(`${path}/users/${id_user}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'new_user_test',
        last_name: 'new_user_test',
        username: 'new_username',
        email: 'usertest@gmail.com',
      }),
    });
    expect(res.status).toBe(200);
  });

  test('DELETE user /users/{id}', async () => {
    const res = await app.request(`${path}/users/${id_user}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await deleteAdmin(id_user, id_auth);
  });
});
