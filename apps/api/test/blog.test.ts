import { exit } from 'node:process';
import app from '../src/index.js';
import { supAdmin } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;
let id_user: number;
let id_auth: string;
let jwt: string;
let id_post: number;
let id_comment: number;

describe('Blog tests', () => {
  test('Create redactor', async () => {
    const res = await app.request(`${path}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'user',
        last_name: 'user',
        username: 'user',
        email: 'user@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const user = await res.json();
    id_auth = user.id_auth;
    id_user = user.id;
    const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user: user.id, id_role: Role.REDACTOR });
    const { error: errorAuth } = await supAdmin.from('USERS_ROLES').insert({ id_user: user.id, id_role: Role.MEMBER });
    if (error || errorAuth) {
      console.error('Error while updating user');
      exit(1);
    }
  });

  test('Login redactor', async () => {
    const res = await app.request(`${path}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(200);
    const user = await res.json();
    jwt = user.token;
  });

  test('Create post', async () => {
    const res = await app.request(`${path}/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        title: 'Post test',
        content: 'Post test content',
        cover_image: 'https://example.com/image.jpg',
      }),
    });
    expect(res.status).toBe(201);
    const post = await res.json();
    id_post = post.id;
  });

  test('Get post', async () => {
    const res = await app.request(`${path}/blog/posts/${id_post}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(res.status).toBe(200);
    const post = await res.json();
    expect(post).toMatchObject({ title: 'Post test' });
  });

  test('Update post', async () => {
    const res = await app.request(`${path}/blog/posts/${id_post}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        title: 'Post test updated',
        content: 'Post test content updated',
      }),
    });
    expect(res.status).toBe(200);
  });

  test('Comment the post', async () => {
    const res = await app.request(`${path}/blog/posts/${id_post}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        content: 'Comment test',
      }),
    });
    expect(res.status).toBe(201);
    const comment = await res.json();
    id_comment = comment.id;
  });

  test('Get comments', async () => {
    const res = await app.request(`${path}/blog/posts/${id_post}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete comment', async () => {
    const res = await app.request(`${path}/blog/posts/${id_post}/comments/${id_comment}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete post', async () => {
    const res = await app.request(`${path}/blog/posts/${id_post}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete redactor', async () => {
    const { error } = await supAdmin.from('USERS').delete().eq('id', id_user);
    const { error: errorAuth } = await supAdmin.auth.admin.deleteUser(id_auth);
    expect(error).toBeNull();
    expect(errorAuth).toBeNull();
  });
});
