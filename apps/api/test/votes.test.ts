import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Votes tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_polls: number;
  let option_id: number;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
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
    await insertRole(id_user, Role.ADMIN);
    await insertRole(id_user, Role.MEMBER);
    await setValidSubscription(id_user);

    const loginRes = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'polls@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
  });

  test('Create poll', async () => {
    const res = await app.request('/polls', {
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

  test('Update poll', async () => {
    const res = await app.request(`/polls/${id_polls}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        title: 'Title test updated',
        description: 'Description test updated',
      }),
    });
    expect(res.status).toBe(200);
  });

  test('Get all polls', async () => {
    const res = await app.request('/polls', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Get poll by id', async () => {
    const res = await app.request(`/polls/${id_polls}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const result: { results: [{ id: number; votes: number; content: string }] } = await res.json();
    option_id = result.results[0].id;
  });

  test('Vote to poll', async () => {
    const res = await app.request(`/polls/${id_polls}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        options: [option_id],
      }),
    });
    expect(res.status).toBe(201);
  });

  test('Vote to poll again not allowed', async () => {
    const res = await app.request(`/polls/${id_polls}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        options: [option_id],
      }),
    });
    expect(res.status).toBe(400);
  });

  test('Get poll results', async () => {
    const res = await app.request(`/polls/${id_polls}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete poll', async () => {
    const res = await app.request(`/polls/${id_polls}`, {
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
