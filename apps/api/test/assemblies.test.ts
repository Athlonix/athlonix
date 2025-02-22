import app from '../src/index.js';
import { addUserToAssembly, checkAssemblyAndUser, getAssemblyWithCode } from '../src/utils/assemblies.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setInvalidSubscription, setValidSubscription } from './utils.js';

describe('Activities tests', () => {
  let id_admin: number;
  let id_auth: string;
  let id_assembly: number;
  let jwt: string;
  let QRcode: string;
  const next_month = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString();

  test('Create admin', async () => {
    const res = await app.request('/auth/signup', {
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
    const res = await app.request('/auth/login', {
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
    const res = await app.request('/assemblies', {
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
    const res = await app.request('/assemblies', {
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
    const res = await app.request(`/assemblies/${id_assembly}`, {
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
    const res = await app.request(`/assemblies/${id_assembly}`, {
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
    const res = await app.request(`/assemblies/${id_assembly}/qr`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const { qrCode }: { qrCode: string } = await res.json();
    QRcode = qrCode;
  });

  test('Add member to assembly', async () => {
    const res = await addUserToAssembly(id_assembly, id_admin);
    expect(res).toBe(true);
  });

  test('Check assembly and user validation', async () => {
    const res = await checkAssemblyAndUser(id_assembly, id_admin);
    expect(res).toBe(true);
  });

  test('Check assembly and user validation with invalid subscription', async () => {
    await setInvalidSubscription(id_admin);
    const res = await checkAssemblyAndUser(id_assembly, id_admin);
    expect(res).toHaveProperty('error');
    await setValidSubscription(id_admin);
  });

  test('Check assembly and user validation with invalid assembly', async () => {
    const res = await checkAssemblyAndUser(0, id_admin);
    expect(res).toHaveProperty('error');
  });

  test('Check assembly and user validation with invalid member', async () => {
    const res = await checkAssemblyAndUser(id_assembly, 0);
    expect(res).toHaveProperty('error');
  });

  test('Get assembly with code from QRcode', async () => {
    const code = QRcode.split('?code=')[1] || QRcode;
    const res = await getAssemblyWithCode(code);
    expect(res).not.toHaveProperty('error');
  });

  test('Close assembly', async () => {
    const res = await app.request(`/assemblies/${id_assembly}/close`, {
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
