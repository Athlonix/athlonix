import { exit } from 'node:process';
import app from '../src/index.js';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;
let id_admin: number;
let id_auth: string;
let id_user: number;
let jwt: string;
let jwt_user: string;
let activity_id: number;

/*
TODO :
 Create sports & Location before creating activity
*/

describe('Activity tests', () => {
  test('Create admin', async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'admin_activity',
        last_name: 'admin_activity',
        username: 'admin_activity',
        email: 'admin_activity@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const user: { id: number; id_auth: string } = await res.json();
    id_auth = user.id_auth;
    id_admin = user.id;
    const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user: user.id, id_role: Role.ADMIN });
    const { error: errorAuth } = await supAdmin.from('USERS_ROLES').insert({ id_user: user.id, id_role: Role.MEMBER });
    if (error || errorAuth) {
      console.error('Error while updating user');
      exit(1);
    }
  });

  test('Login admin', async () => {
    const res = await app.request(`${path}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin_activity@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(200);
    const admin: { token: string } = await res.json();
    jwt = admin.token;
  });

  // create activity, create user, login user, apply activity, valide application, get user activities, delete activity, delete user, delete admin

  test('Create activity', async () => {
    const res = await app.request(`${path}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'Activity test',
        description: 'Description test',
        max_participants: 10,
        min_participants: 1,
        days: ['monday', 'tuesday'],
        start_date: new Date().toISOString(),
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        recurrence: 'weekly',
        interval: 1,
        id_sport: null,
        id_address: null,
      }),
    });
    expect(res.status).toBe(201);
    const activity: { id: number } = await res.json();
    activity_id = activity.id;
  });

  test('Create user', async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'user_test',
        last_name: 'user_test',
        username: 'user_test',
        email: 'user_test@gmail.com',
        password: 'password1234567',
      }),
    });
    expect(res.status).toBe(201);
    const user: { id: number; id_auth: string } = await res.json();
    id_user = user.id;
    id_auth = user.id_auth;

    const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user: user.id, id_role: Role.MEMBER });
    if (error) {
      console.error('Error while updating user');
      exit(1);
    }
  });

  test('Login user', async () => {
    const res = await app.request(`${path}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user_test@gmail.com',
        password: 'password1234567',
      }),
    });
    expect(res.status).toBe(200);
    const user: { token: string } = await res.json();
    jwt_user = user.token;
  });

  test('Apply activity', async () => {
    const res = await app.request(`${path}/activities/${activity_id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt_user}`,
      },
    });
    expect(res.status).toBe(201);
  });

  test('Valide application', async () => {
    const res = await app.request(`${path}/activities/${activity_id}/validApply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        id_user: id_user,
      }),
    });
    expect(res.status).toBe(200);
  });

  test('Get user activities', async () => {
    const res = await app.request(`${path}/users/${id_user}/activities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete activity', async () => {
    const res = await app.request(`${path}/activities/${activity_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete user', async () => {
    const res = await app.request(`${path}/users/${id_user}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete admin', async () => {
    const res = await app.request(`${path}/users/${id_admin}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });
});
