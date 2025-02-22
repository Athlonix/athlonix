import fs from 'node:fs';
import path from 'node:path';
import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Activities tests', () => {
  let id_admin: number;
  let id_auth: string;
  let id_user: number;
  let jwt: string;
  let activity_id: number;
  let id_sport: number;
  let id_location: number;
  let id_activity_exception: number;
  let id_task: number;
  const now = new Date();
  const end = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  const start_date = now.toISOString().split('T')[0];
  const end_date = end.toISOString().split('T')[0];

  test('Create admin', async () => {
    const res = await app.request('/auth/signup', {
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
    await insertRole(id_admin, Role.ADMIN);
    await insertRole(id_admin, Role.MEMBER);
    await setValidSubscription(id_admin);
  });

  test('Login admin', async () => {
    const res = await app.request('/auth/login', {
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

  test('Create sport', async () => {
    const res = await app.request('/sports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'Sport activities test',
        description: 'Description test',
        min_players: 1,
        max_players: 10,
        image: 'image',
      }),
    });
    expect(res.status).toBe(201);
    const sport: { id: number } = await res.json();
    id_sport = sport.id;
  });

  test('Create location', async () => {
    const res = await app.request('/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        road: 'string',
        postal_code: 'string',
        complement: 'string',
        city: 'string',
        number: 0,
        name: 'string',
        id_lease: null,
      }),
    });
    expect(res.status).toBe(201);
    const location: { id: number } = await res.json();
    id_location = location.id;
  });

  test('Create activity', async () => {
    const now = new Date();
    const end = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    const start_time = now.toTimeString().split(' ')[0];
    const end_time = end.toTimeString().split(' ')[0];

    const formData = new FormData();
    formData.append('name', 'Activity test');
    formData.append('description', 'Description test');
    formData.append('max_participants', '10');
    formData.append('min_participants', '1');
    formData.append('days_of_week', JSON.stringify(['monday', 'tuesday']));
    formData.append('start_date', String(start_date));
    formData.append('end_date', String(end_date));
    formData.append('start_time', String(start_time));
    formData.append('end_time', String(end_time));
    formData.append('frequency', 'weekly');
    formData.append('id_sport', String(id_sport));
    formData.append('id_address', String(id_location));

    const imagePath = path.join(__dirname, 'files', 'mock_image.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image', imageBlob, 'mock_image.png');

    const res = await app.request('/activities', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    expect(res.status).toBe(201);
    const activity: { id: number } = await res.json();
    activity_id = activity.id;
  });

  test('Create activity exception', async () => {
    const res = await app.request(`/activities/${activity_id}/exceptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        date: '2024-05-27',
        min_participants: 1,
        max_participants: 10,
      }),
    });

    expect(res.status).toBe(201);
    const activity_exception: { id: number } = await res.json();
    id_activity_exception = activity_exception.id;
  });

  test('Create employee', async () => {
    const res = await app.request('/auth/signup', {
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
    const user: { id: number } = await res.json();
    id_user = user.id;

    await insertRole(id_user, Role.EMPLOYEE);
    await setValidSubscription(id_user);
  });

  test('Add employee to activity team', async () => {
    const res = await app.request(`/activities/${activity_id}/team/${id_user}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: null,
    });

    expect(res.status).toBe(201);
  });

  test('Create task', async () => {
    const res = await app.request(`/activities_exceptions/${id_activity_exception}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({
        priority: 'P0',
        status: 'not started',
        title: 'Test Activity Task',
        description: 'Test Activity Task Description',
        id_employee: id_user,
      }),
    });
    expect(res.status).toBe(201);
    const task: { id: number } = await res.json();
    id_task = task.id;
  });

  test('Get all activity tasks', async () => {
    const res = await app.request(`/activities/${activity_id}/tasks?start_date=2024-05-27&end_date=2024-05-27`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);

    const { data } = (await res.json()) as { data: { id: number }[] };
    expect(data.length).toBeGreaterThan(0);
  });

  test('Get exception tasks', async () => {
    const res = await app.request(`/activities_exceptions/${id_activity_exception}/tasks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);

    const { data } = (await res.json()) as { data: { id: number }[] };
    expect(data.length).toBeGreaterThan(0);
  });

  test('Get all tasks of exception', async () => {
    const res = await app.request(`/activities_exceptions/${id_activity_exception}/tasks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);

    const { data } = (await res.json()) as { data: { id: number }[] };
    expect(data.length).toBeGreaterThan(0);
  });

  test('Get single task', async () => {
    const res = await app.request(`/tasks/${id_task}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);
  });

  test('Update task', async () => {
    const res = await app.request(`/tasks/${id_task}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        status: 'completed',
      }),
    });
    expect(res.status).toBe(200);
  });

  test('Delete task', async () => {
    const res = await app.request(`/tasks/${id_task}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Remove employee from team', async () => {
    const res = await app.request(`/activities/${activity_id}/team/${id_user}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete activity exception', async () => {
    const res = await app.request(`/activities_exceptions/${id_activity_exception}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete activity', async () => {
    const res = await app.request(`/activities/${activity_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete user', async () => {
    const res = await app.request(`/users/${id_user}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete location', async () => {
    const res = await app.request(`/addresses/${id_location}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
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

  afterAll(async () => {
    await deleteAdmin(id_admin, id_auth);
  });
});
