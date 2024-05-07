import app from '../src/index.js';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole } from './utils.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;

describe('Location tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_location: number;

  beforeAll(async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'location',
        last_name: 'location',
        username: 'location',
        email: 'location@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const user: { id: number; id_auth: string } = await res.json();
    id_auth = user.id_auth;
    id_user = user.id;
    await insertRole(id_user, Role.ADMIN);
    await insertRole(id_user, Role.MEMBER);

    const loginRes = await app.request(`${path}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'location@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
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
    const location: { id: number } = await res.json();
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

  afterAll(async () => {
    await deleteAdmin(id_user, id_auth);
  });
});
