import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Messages tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_proposal: number;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'proposals',
        last_name: 'proposals',
        username: 'proposals',
        email: 'proposals@gmail.com',
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
        email: 'proposals@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
  });

  test('Create a proposal', async () => {
    const res = await app.request('/proposals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        proposal: 'proposal test',
      }),
    });
    expect(res.status).toBe(201);
    const proposal: { id: number } = await res.json();
    id_proposal = proposal.id;
  });

  test('Get all proposals', async () => {
    const res = await app.request('/proposals', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const { data, count } = await res.json();
    expect(data).toBeInstanceOf(Array);
    expect(count).toBeGreaterThan(0);
  });

  test('Get all proposals with pagination', async () => {
    const res = await app.request('/proposals?skip=0&take=1', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const { data, count } = await res.json();
    expect(data).toBeInstanceOf(Array);
    expect(count).toBeGreaterThan(0);
  });

  test('Get all proposals with search', async () => {
    const res = await app.request('/proposals?search=proposal', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const { data, count } = await res.json();
    expect(data).toBeInstanceOf(Array);
    expect(count).toBeGreaterThan(0);
  });

  test('Delete a proposal', async () => {
    const res = await app.request(`/proposals/${id_proposal}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await deleteAdmin(id_user, id_auth);
  });
});
