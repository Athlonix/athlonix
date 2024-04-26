import { exit } from 'node:process';
import app from '../src/index.js';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;
let id_user: number;
let id_auth: string;
let jwt: string;
let id_polls: number;

describe('Votes tests', () => {
  test('Create admin', async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'polls',
        last_name: 'polls',
        username: 'polls',
        email: 'polls@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const user: { id: number; id_auth: string } = await res.json();
    id_auth = user.id_auth;
    id_user = user.id;
    const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user: user.id, id_role: Role.ADMIN });
    if (error) {
      console.error('Error while updating user: ', error);
      exit(1);
    }
  });

  test('Login admin', async () => {
    const res = await app.request(`${path}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'polls@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(200);
    const user: { token: string } = await res.json();
    jwt = user.token;
  });

  test('Create poll', async () => {
    const res = await app.request(`${path}/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        title: 'Title test',
        description: 'Description test',
        start_at: new Date().toISOString(),
        end_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        max_choices: 2,
        options: [{ content: 'Option test' }, { content: 'Option test 2' }, { content: 'Option test 3' }],
      }),
    });
    expect(res.status).toBe(201);
    const poll: { id: number } = await res.json();
    id_polls = poll.id;
  });

  test('Get all polls', async () => {
    const res = await app.request(`${path}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Vote to poll', async () => {
    const res = await app.request(`${path}/polls/${id_polls}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        options: [1, 2],
      }),
    });
    expect(res.status).toBe(201);
  });

  test('Vote to poll again not allowed', async () => {
    const res = await app.request(`${path}/polls/${id_polls}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        options: [1, 3],
      }),
    });
    expect(res.status).toBe(400);
  });

  test('Get poll results', async () => {
    const res = await app.request(`${path}/polls/${id_polls}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete poll', async () => {
    const res = await app.request(`${path}/polls/${id_polls}`, {
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
