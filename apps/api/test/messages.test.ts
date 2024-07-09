import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Messages tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_msg: number;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'message',
        last_name: 'message',
        username: 'message',
        email: 'message@gmail.com',
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
        email: 'message@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
  });

  test('Create message', async () => {
    const res = await app.request('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        id_sender: id_user,
        message: 'message test',
      }),
    });
    expect(res.status).toBe(201);
    const message: { id: number } = await res.json();
    id_msg = message.id;
  });

  test('Get all messages', async () => {
    const res = await app.request('/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Get all messages with pagination and search', async () => {
    const res = await app.request('/messages?page=1&limit=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Update message', async () => {
    const res = await app.request(`/messages/${id_msg}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        message: 'message test updated',
      }),
    });
    expect(res.status).toBe(200);
  });

  test('Delete message', async () => {
    const res = await app.request(`/messages/${id_msg}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Should fail to update messages', async () => {
    const res = await app.request(`/messages/${id_msg}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        message: 'message test updated again',
      }),
    });
    expect(res.status).toBe(404);
  });

  test('Should fail to delete message', async () => {
    const res = await app.request(`/messages/${id_msg}`, {
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
