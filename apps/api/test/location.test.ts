import { exit } from 'node:process';
import app from '../src/index.js';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;
let id_user: number;
let id_auth: string;
let jwt: string;
let id_location: number;

describe('Location tests', () => {
  test('Create admin', async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'user',
        last_name: 'user',
        username: 'user',
        email: 'user@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const user = await res.json();
    id_auth = user.id_auth;
    id_user = user.id;
    const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user: user.id, id_role: Role.ADMIN });
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
        email: 'user@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(200);
    const user = await res.json();
    jwt = user.token;
  });

  test('Create address', async () => {
    const res = await app.request(`${path}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        road: 'Road test',
        postal_code: '12345',
        complement: 'Complement test',
        city: 'City test',
        number: 123,
        name: 'Name test',
        id_lease: null,
      }),
    });
    expect(res.status).toBe(201);
    const location = await res.json();
    id_location = location.id;
  });

  test('Get all addresses', async () => {
    const res = await app.request(`${path}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Update address', async () => {
    const res = await app.request(`${path}/addresses/${id_location}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        road: 'Road test',
        postal_code: '12345',
        complement: 'Complement test',
        city: 'City test',
        number: 123,
        name: 'Name test',
        id_lease: null,
      }),
    });
    expect(res.status).toBe(200);
  });

  test('Delete address', async () => {
    const res = await app.request(`${path}/addresses/${id_location}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete admin', async () => {
    const { error } = await supAdmin.from('USERS').delete().eq('id', id_user);
    const { error: errorAuth } = await supAdmin.auth.admin.deleteUser(id_auth);
    expect(error).toBeNull();
    expect(errorAuth).toBeNull();
  });
});
