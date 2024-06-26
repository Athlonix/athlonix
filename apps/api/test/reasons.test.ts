import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Reasons tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_reason: number;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'reason',
        last_name: 'reason',
        username: 'reason',
        email: 'reason@gmail.com',
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
        email: 'reason@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
  });

  test('Create reason', async () => {
    const res = await app.request('/reasons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        reason: 'Test reason',
      }),
    });
    expect(res.status).toBe(200);
    const reason = await res.json();
    expect(reason).toHaveProperty('id');
    expect(reason).toHaveProperty('reason', 'Test reason');
    id_reason = reason.id;
  });

  test('Create reason with invalid data', async () => {
    const res = await app.request('/reasons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        reason: '',
      }),
    });
    expect(res.status).toBe(400);
  });

  test('Get all reasons', async () => {
    const res = await app.request('/reasons', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const reasons = await res.json();
    expect(Array.isArray(reasons)).toBe(true);
    expect(reasons.length).toBeGreaterThan(0);
  });

  test('Get reason by id', async () => {
    const res = await app.request(`/reasons/${id_reason}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const reason = await res.json();
    expect(reason).toHaveProperty('id', id_reason);
    expect(reason).toHaveProperty('reason', 'Test reason');
  });

  test('Get non-existent reason', async () => {
    const res = await app.request('/reasons/99999', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(404);
  });

  test('Update reason', async () => {
    const res = await app.request(`/reasons/${id_reason}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        reason: 'Updated test reason',
      }),
    });
    expect(res.status).toBe(200);
    const updatedReason = await res.json();
    expect(updatedReason).toHaveProperty('id', id_reason);
    expect(updatedReason).toHaveProperty('reason', 'Updated test reason');
  });

  test('Update non-existent reason', async () => {
    const res = await app.request('/reasons/99999', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        reason: 'This should fail',
      }),
    });
    expect(res.status).toBe(404);
  });

  test('Delete reason', async () => {
    const res = await app.request(`/reasons/${id_reason}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const deletedReason = await res.json();
    expect(deletedReason).toHaveProperty('message', 'Reason deleted');
  });

  test('Delete non-existent reason', async () => {
    const res = await app.request('/reasons/99999', {
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
