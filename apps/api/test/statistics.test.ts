import { describe } from 'vitest';
import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Statistics tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'stats',
        last_name: 'stats',
        username: 'stats',
        email: 'stats@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const user: { id: number; id_auth: string } = await res.json();
    id_auth = user.id_auth;
    id_user = user.id;
    await insertRole(id_user, Role.ADMIN);
    await insertRole(id_user, Role.MEMBER);
    await setValidSubscription(id_user);

    const loginRes = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'stats@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
  });

  test('Get statistics', async () => {
    const response = await app.request('/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(response.status).toBe(200);
    const stats = await response.json();
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty('totalMembers');
    expect(stats).toHaveProperty('totalActivities');
  });

  test('Get statistics with invalid token', async () => {
    const response = await app.request('/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid_token',
      },
    });
    expect(response.status).toBe(403);
  });

  afterAll(async () => {
    await deleteAdmin(id_user, id_auth);
  });
});
