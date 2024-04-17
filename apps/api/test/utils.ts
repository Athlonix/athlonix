import app from '../src/index.js';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general';

export const testAdmin = {
  first_name: 'admin',
  last_name: 'admin',
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'fulladminpassword123456',
};

export async function createAdmin() {
  const port = Number(process.env.PORT || 3101);
  const path = `http://localhost:${port}`;
  const res = await app.request(`${path}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testAdmin),
  });
  console.error('HERE', res.status);

  const admin = await res.json();
  console.log(admin);

  const { error } = await supAdmin.from('USERS').update({ id_role: Role.ADMIN }).eq('id', admin.id);
  if (error) {
    throw new Error('Error while updating user');
  }
  return admin;
}

export async function loginAdmin() {
  const port = Number(process.env.PORT || 3101);
  const path = `http://localhost:${port}`;
  const res = await app.request(`${path}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@gmail.com',
      password: 'fulladminpassword123456',
    }),
  });
  return await res.json();
}

export async function deleteAdmin(id: number, id_auth: string) {
  const { error } = await supAdmin.from('USERS').delete().eq('id', id);
  if (error) {
    throw new Error('Error while deleting user');
  }
  const { error: errorAuth } = await supAdmin.auth.admin.deleteUser(id_auth.toString());
  if (errorAuth) {
    throw new Error('Error while deleting admin user');
  }
}

export const testUser = {
  first_name: 'user_test',
  last_name: 'user_test',
  username: 'user_test',
  email: 'usertest@gmail.com',
  password: 'password123456',
};

export async function createTestUser(member = true) {
  const port = Number(process.env.PORT || 3101);
  const path = `http://localhost:${port}`;
  const res = await app.request(`${path}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const user = await res.json();
  if (member) {
    const { error } = await supAdmin.from('USERS').update({ id_role: Role.MEMBER }).eq('id', user.id);
    if (error) {
      throw new Error('Error while updating user');
    }
  }
  return user;
}

export async function loginTestUser() {
  const port = Number(process.env.PORT || 3101);
  const path = `http://localhost:${port}`;
  const res = await app.request(`${path}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'usertest@gmail.com',
      password: 'password123456',
    }),
  });
  return await res.json();
}

export async function deleteTestUser(id: number, id_auth: string) {
  const { error } = await supAdmin.from('USERS').delete().eq('id', id);
  if (error) {
    throw new Error('Error while deleting user');
  }
  const { error: errorAuth } = await supAdmin.auth.admin.deleteUser(id_auth.toString());
  if (errorAuth) {
    throw new Error('Error while deleting user');
  }
}
