import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Blog tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_post: number;
  let id_comment: number;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'blog',
        last_name: 'blog',
        username: 'blog',
        email: 'blog@gmail.com',
        password: 'password123456',
      }),
    });
    expect(res.status).toBe(201);
    const user: { id: number; id_auth: string } = await res.json();
    id_auth = user.id_auth;
    id_user = user.id;
    await insertRole(id_user, Role.REDACTOR);
    await insertRole(id_user, Role.MEMBER);
    await setValidSubscription(id_user);

    const loginRes = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'blog@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;
  });

  test('Create post', async () => {
    const res = await app.request('/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        title: 'Post test',
        content: 'Post test content',
        cover_image: 'https://example.com/image.jpg',
        description: 'Post test description',
      }),
    });
    expect(res.status).toBe(201);
    const post: { id: number } = await res.json();
    id_post = post.id;
  });

  test('Get post', async () => {
    const res = await app.request(`/blog/posts/${id_post}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(res.status).toBe(200);
    const post: { title: string } = await res.json();
    expect(post).toMatchObject({ title: 'Post test' });
  });

  test('Update post', async () => {
    const res = await app.request(`/blog/posts/${id_post}`, {
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
    const res = await app.request(`/blog/posts/${id_post}/comments`, {
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
    const comment: { id: number } = await res.json();
    id_comment = comment.id;
  });

  test('Get comments', async () => {
    const res = await app.request(`/blog/posts/${id_post}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete comment', async () => {
    const res = await app.request(`/blog/posts/${id_post}/comments/${id_comment}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Delete post', async () => {
    const res = await app.request(`/blog/posts/${id_post}`, {
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
