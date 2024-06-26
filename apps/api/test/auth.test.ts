import app from '../src/index.js';
import { deleteAdmin } from './utils.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;

describe('Auth tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'auth_test',
        last_name: 'auth_test',
        username: 'auth_test',
        email: 'auth_test@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const users: { id: number; id_auth: string } = await res.json();
    expect(users).toMatchObject({ first_name: 'auth_test' });
    id_auth = users.id_auth;
    id_user = users.id;
  });

  test('POST /auth/login', async () => {
    const res = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'auth_test@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(200);
    const user: { token: string } = await res.json();
    jwt = user.token;
  });

  test('POST /auth/login with wrong password', async () => {
    const res = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'auth_test@gmail.com',
        password: 'fake-super-password',
      }),
    });
    expect(res.status).toBe(401);
  });

  test('Get /users/me', async () => {
    const res = await app.request('/users/me', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ first_name: 'auth_test' });
  });

  test('Logout /auth/logout', async () => {
    const res = await app.request('/auth/logout', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await deleteAdmin(id_user, id_auth);
  });
});
