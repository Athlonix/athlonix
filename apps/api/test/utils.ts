import { exit } from 'node:process';
import type { Hono } from 'hono';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general';

export const testAdmin = {
  first_name: 'admin',
  last_name: 'admin',
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'fulladminpassword123456',
};

export async function createAdmin(app: Hono) {
  const port = Number(process.env.PORT || 3101);
  const path = `http://localhost:${port}`;
  const res = await app.request(`${path}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testAdmin),
  });

  const admin = await res.json();
  const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user: admin.id, id_role: Role.ADMIN });
  if (error) {
    console.error('Error while updating user');
    exit(1);
  }
  return admin;
}

export async function loginAdmin(app: Hono) {
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
  const admin = await res.json();
  return admin;
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

export async function createTestUser(app: Hono, member = true) {
  const port = Number(process.env.PORT || 3101);
  const path = `http://localhost:${port}`;
  const res = await app.request(`${path}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const user = await res.json();
  if (member) {
    const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user: user.id, id_role: Role.MEMBER });
    if (error) {
      console.error('Error while updating user');
      exit(1);
    }
  }
  return user;
}

export async function loginTestUser(app: Hono) {
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
