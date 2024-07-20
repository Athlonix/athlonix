import app from '../src/index.js';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('User tests', () => {
  let id_user: number;
  let id_auth: string;
  let id_admin: number;
  let auth_admin: string;
  let jwt: string;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'admin_user',
        last_name: 'admin_user',
        username: 'admin_user',
        email: 'admin_user@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const admin: { id: number; id_auth: string } = await res.json();
    auth_admin = admin.id_auth;
    id_admin = admin.id;
    await insertRole(id_admin, Role.ADMIN);
    await insertRole(id_admin, Role.MEMBER);
    await setValidSubscription(id_admin);

    const loginRes = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin_user@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginAdmin: { token: string } = await loginRes.json();
    jwt = loginAdmin.token;
  });

  test('Create user', async () => {
    const res = await app.request('/auth/signup', {
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
    const user: { id: number; id_auth: string } = await res.json();
    id_user = user.id;
    id_auth = user.id_auth;
  });

  test('GET All users /users', async () => {
    const res = await app.request('/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);
  });

  test('GET user /users/{id}', async () => {
    const res = await app.request(`/users/${id_user}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);
  });

  test('GET user /users/{id} with wrong id', async () => {
    const res = await app.request('/users/20000', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(404);
  });

  test('PATCH user /users/{id}', async () => {
    const res = await app.request(`/users/${id_user}`, {
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
    const res = await app.request(`/users/${id_user}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id_role: Role.MODERATOR }),
    });
    expect(res.status).toBe(201);
  });

  test('GET user by role /users?role={role}', async () => {
    const res = await app.request('/users?role=MODERATOR', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);
  });

  test('Get athlonix hierarchy /users/hierarchy', async () => {
    const res = await app.request('/users/hierarchy', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);
  });

  test('Update user role /users/{id}/roles', async () => {
    const res = await app.request(`/users/${id_user}/roles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ roles: [Role.ADMIN] }),
    });
    expect(res.status).toBe(200);
  });

  test('Remove role from user', async () => {
    const res = await app.request(`/users/${id_user}/roles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id_role: Role.ADMIN }),
    });
    expect(res.status).toBe(200);
  });

  test('Apply for user subscription /users/{id}/status', async () => {
    const res = await app.request(`/users/${id_user}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ status: 'applied' }),
    });
    expect(res.status).toBe(200);
  });

  test('Valid user subscription /users/{id}/status', async () => {
    const res = await app.request(`/users/${id_user}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ status: 'approved' }),
    });
    expect(res.status).toBe(200);
  });

  test('Soft delete user /users/{id}', async () => {
    const res = await app.request(`/users/${id_user}/soft`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(200);

    const { error } = await supAdmin.from('USERS').delete().eq('id', id_user);
    if (error) throw new Error('Error while deleting user');
  });

  afterAll(async () => {
    await deleteAdmin(id_admin, auth_admin);
  });
});
