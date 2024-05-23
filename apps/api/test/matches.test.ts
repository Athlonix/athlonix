import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;

describe('Matches tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_match: number;
  let id_team: number;
  let id_tournament: number;

  beforeAll(async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'match',
        last_name: 'match',
        username: 'match',
        email: 'match@gmail.com',
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

    const loginRes = await app.request(`${path}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'match@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
  });

  test('Create match', async () => {
    const res = await app.request(`${path}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        start_time: '2050-05-12T15:44:17.153Z',
        end_time: '2050-05-13T15:44:17.153Z',
      }),
    });

    expect(res.status).toBe(201);
    const match = (await res.json()) as { id: number };
    id_match = match.id;
  });

  test('Get matches', async () => {
    const res = await app.request(`${path}/matches`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    expect(res.status).toBe(200);
    const matches: { data: { id: number }[] } = await res.json();
    expect(matches.data.length).toBeGreaterThan(0);
  });

  test('Create tournament', async () => {
    const res = await app.request(`${path}/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'tournament test',
        default_match_length: 10,
        max_participants: 10,
        team_capacity: 5,
      }),
    });
    expect(res.status).toBe(201);
    const tournament: { id: number } = await res.json();
    expect(tournament.id).toBeDefined();
    id_tournament = tournament.id;
  });

  test('Create team', async () => {
    const res = await app.request(`${path}/tournaments/${id_tournament}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'team test',
        id_tournament,
      }),
    });
    expect(res.status).toBe(201);
    const team: { id: number } = await res.json();
    expect(team.id).toBeDefined();
    id_team = team.id;
  });

  test('Create match for a tournament', async () => {
    const res = await app.request(`${path}/matches/${id_match}/tournaments/${id_tournament}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        round: 1,
      }),
    });

    expect(res.status).toBe(201);
  });

  test('Update match', async () => {
    const res = await app.request(`${path}/matches/${id_match}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        start_time: '2050-05-12T15:44:17.153Z',
        end_time: '2050-05-14T15:44:17.153Z',
      }),
    });

    expect(res.status).toBe(200);
  });

  test('Update match winner', async () => {
    const res = await app.request(`${path}/matches/${id_match}/winner?idTeam=${id_team}&winner=true`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    expect(res.status).toBe(200);
  });

  test('Delete team', async () => {
    const res = await app.request(`${path}/tournaments/${id_tournament}/teams/${id_team}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    expect(res.status).toBe(200);
  });

  test('Delete match from tournament', async () => {
    const res = await app.request(`${path}/matches/${id_match}/tournaments/${id_tournament}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    expect(res.status).toBe(200);
  });

  test('Delete match', async () => {
    const res = await app.request(`${path}/matches/${id_match}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    expect(res.status).toBe(200);
  });

  test('Delete tournament', async () => {
    const res = await app.request(`${path}/tournaments/${id_tournament}`, {
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
