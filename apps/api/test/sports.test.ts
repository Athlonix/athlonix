import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Sports tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_sport: number;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'sport',
        last_name: 'sport',
        username: 'sport',
        email: 'sport@gmail.com',
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
        email: 'sport@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
  });

  test('Create sport', async () => {
    const res = await app.request('/sports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'sport test',
        description: 'nice sport',
        min_players: 1,
        max_players: 100,
        image: 'https://www.google.com',
      }),
    });
    expect(res.status).toBe(201);
    const sport: { id: number } = await res.json();
    id_sport = sport.id;
  });

  test('Get all sports', async () => {
    const res = await app.request('/sports?all=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Get all sports with pagination and search', async () => {
    const res = await app.request('/sports?page=1&limit=10&search=sport', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Get sport by id', async () => {
    const res = await app.request(`/sports/${id_sport}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Update sport', async () => {
    const res = await app.request(`/sports/${id_sport}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'sport test updated',
        description: 'nice sport updated',
        min_players: 1,
        max_players: 100,
        image: 'https://www.google.com',
      }),
    });
    expect(res.status).toBe(200);
  });

  test('Delete sport', async () => {
    const res = await app.request(`/sports/${id_sport}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Should fail to get sport by id', async () => {
    const res = await app.request(`/sports/${id_sport}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(404);
  });

  test('Should fail to update sport', async () => {
    const res = await app.request(`/sports/${id_sport}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'sport test updated',
        description: 'nice sport updated',
        min_players: 1,
        max_players: 100,
        image: 'https://www.google.com',
      }),
    });
    expect(res.status).toBe(404);
  });

  test('Should fail to delete sport', async () => {
    const res = await app.request(`/sports/${id_sport}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    await deleteAdmin(id_user, id_auth);
  });
});
