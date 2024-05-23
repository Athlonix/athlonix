import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;

describe('Tournaments tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_tournament: number;
  let id_team: number;

  beforeAll(async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'tournament',
        last_name: 'tournament',
        username: 'tournament',
        email: 'tournament@gmail.com',
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
        email: 'tournament@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
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

  test('Update tournament', async () => {
    const res = await app.request(`${path}/tournaments/${id_tournament}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'tournament test updated',
      }),
    });
    expect(res.status).toBe(200);
    const tournament: { name: string } = await res.json();
    expect(tournament.name).toBe('tournament test updated');
  });

  test('Get all tournaments', async () => {
    const res = await app.request(`${path}/tournaments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const tournaments: { data: Array<{ id: number }> } = await res.json();
    expect(tournaments.data).toBeDefined();
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

  test('Get all teams', async () => {
    const res = await app.request(`${path}/tournaments/${id_tournament}/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Update team', async () => {
    const res = await app.request(`${path}/tournaments/${id_tournament}/teams/${id_team}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'team test updated',
      }),
    });
    expect(res.status).toBe(200);
    const team: { name: string } = await res.json();
    expect(team.name).toBe('team test updated');
  });

  test('Join team', async () => {
    const res = await app.request(`${path}/tournaments/${id_tournament}/teams/${id_team}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Leave team', async () => {
    const res = await app.request(`${path}/tournaments/${id_tournament}/teams/${id_team}/leave`, {
      method: 'DELETE',
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
