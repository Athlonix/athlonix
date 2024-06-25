import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;

describe('Activities tests', () => {
  let id_admin: number;
  let id_auth: string;
  let id_assembly: number;
  let jwt: string;
  const next_month = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString();

  test('Create admin', async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'admin_asm',
        last_name: 'admin_asm',
        username: 'admin_asm',
        email: 'admin_asm@gmail.com',
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
    const res = await app.request(`${path}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin_asm@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(200);
    const admin: { token: string } = await res.json();
    jwt = admin.token;
  });

  test('Create assembly', async () => {
    const res = await app.request(`${path}/assemblies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: 'assembly_test',
        description: 'assembly_test',
        date: next_month,
        location: null,
        lawsuit: null,
      }),
    });
    expect(res.status).toBe(201);
    const assembly: { id: number } = await res.json();
    id_assembly = assembly.id;
  });

  test('Get all assemblies', async () => {
    const res = await app.request(`${path}/assemblies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const { count }: { count: number } = await res.json();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Get one assembly', async () => {
    const res = await app.request(`${path}/assemblies/${id_assembly}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const assembly: { id: number } = await res.json();
    expect(assembly.id).toBe(id_assembly);
  });

  test('Update assembly', async () => {
    const res = await app.request(`${path}/assemblies/${id_assembly}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        lawsuit: 'assembly_test_updated',
      }),
    });
    expect(res.status).toBe(200);
    const assembly: { lawsuit: string } = await res.json();
    expect(assembly.lawsuit).toBe('assembly_test_updated');
  });

  test('Generate assembly QRcode', async () => {
    const res = await app.request(`${path}/assemblies/${id_assembly}/qr`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Close assembly', async () => {
    const res = await app.request(`${path}/assemblies/${id_assembly}/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        lawsuit:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      }),
    });
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await deleteAdmin(id_admin, id_auth);
  });
});
