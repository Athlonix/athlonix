import app from '../src/index.js';
import { createAdmin, createTestUser, deleteAdmin, deleteTestUser, loginAdmin, testAdmin, testUser } from './utils.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;
let id_user: number;
let id_auth: string;

describe('User tests', () => {
  beforeAll(async () => {
    await createAdmin();
    const res = await createTestUser();
    id_user = res.id;
    id_auth = res.id_auth;
    await loginAdmin();
  });

  test('GET user /user/{id}', async () => {
    const res = await app.request(`${path}/user/${id_user}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);
  });

  test('GET user /user/{id} with wrong id', async () => {
    const res = await app.request(`${path}/user/0`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(404);
  });

  test('PATCH user /user/{id}', async () => {
    const res = await app.request(`${path}/user/${id_user}`, {
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

  test('DELETE user /user/{id}', async () => {
    const res = await app.request(`${path}/user/${id_user}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await deleteAdmin(id_user, id_auth);
  });
});
