// import app from '../src/index.js';
// import { supAdmin } from '../src/libs/supabase.js';

// const port = Number(process.env.PORT || 3101);
// const path = `http://localhost:${port}`;
// let id_user: number;
// let id_auth: string;

// describe('Auth tests', () => {
//   test('POST /auth/signup', async () => {
//     const res = await app.request(`${path}/auth/signup`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         first_name: 'John',
//         last_name: 'Doe',
//         username: 'john_doe',
//         email: 'john@gmail.com',
//         password: 'password123456',
//       }),
//     });
//     expect(res.status).toBe(201);
//     const users = await res.json();
//     expect(users).toMatchObject({ first_name: 'John' });
//     id_auth = users.id_auth;
//     id_user = users.id;
//   });

//   test('POST /auth/login', async () => {
//     const res = await app.request(`${path}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: 'john@gmail.com',
//         password: 'password123456',
//       }),
//     });
//     expect(res.status).toBe(200);
//   });

//   test('POST /auth/login with wrong password', async () => {
//     const res = await app.request(`${path}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: 'john@gmail.com',
//         password: 'fake-super-password',
//       }),
//     });
//     expect(res.status).toBe(401);
//   });

//   afterAll(async () => {
//     const { error } = await supAdmin.from('USERS').delete().eq('id', id_user);
//     const { error: errorAuth } = await supAdmin.auth.admin.deleteUser(id_auth);
//     expect(error).toBeNull();
//     expect(errorAuth).toBeNull();
//   });
// });
