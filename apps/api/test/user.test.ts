import { exit } from 'node:process';
import app from '../src/index.js';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general';
import { deleteAdmin } from './utils.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;
let id_user: number;
let id_auth: string;
let id_admin: number;
let auth_admin: string;
let jwt: string;

describe('User tests', () => {
  test('Create admin', async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'admin',
        last_name: 'admin',
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const admin = await res.json();
    auth_admin = admin.id_auth;
    id_admin = admin.id;
    const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user: admin.id, id_role: Role.ADMIN });
    if (error) {
      console.error('Error while updating user');
      exit(1);
    }
  });

  test('Login admin', async () => {
    const res = await app.request(`${path}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(200);
    const admin = await res.json();
    jwt = admin.token;
  });

  test('Create user', async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'user_test',
        last_name: 'user_test',
        username: 'user_test',
        email: 'usertest@gmail.com',
        password: 'password1234567',
      }),
    });
    expect(res.status).toBe(201);
    const user = await res.json();
    id_user = user.id;
    id_auth = user.id_auth;
  });

  test('GET user /users/{id}', async () => {
    const res = await app.request(`${path}/users/${id_user}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);
  });

  test('GET user /users/{id} with wrong id', async () => {
    const res = await app.request(`${path}/users/20000`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(404);
  });

  test('PATCH user /users/{id}', async () => {
    const res = await app.request(`${path}/users/${id_user}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({
        first_name: 'new_user_test',
        last_name: 'new_user_test',
        username: 'new_username',
      }),
    });
    expect(res.status).toBe(200);
  });

  test('Add role to user', async () => {
    const res = await app.request(`${path}/users/${id_user}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id_role: Role.MODERATOR }),
    });
    expect(res.status).toBe(201);
  });

  test('Remove role from user', async () => {
    const res = await app.request(`${path}/users/${id_user}/roles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id_role: Role.MODERATOR }),
    });
    expect(res.status).toBe(200);
  });

  test('DELETE user /users/{id}', async () => {
    const res = await app.request(`${path}/users/${id_user}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await deleteAdmin(id_admin, auth_admin);
  });
});
