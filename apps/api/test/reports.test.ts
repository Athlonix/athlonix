import fs from 'node:fs';
import path from 'node:path';
import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Report tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_post: number;
  let id_comment: number;
  let id_report: number;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'report',
        last_name: 'report',
        username: 'report',
        email: 'report@gmail.com',
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

    const loginRes = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'report@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    jwt = loginUser.token;

    const formData = new FormData();

    formData.append('title', 'Post test report');
    formData.append('description', 'Post test description');
    formData.append('content', 'Post test content for reporting');

    const imagePath = path.join(__dirname, 'files', 'mock_image.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('cover_image', imageBlob, 'mock_image.png');

    const resPost = await app.request('/blog/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    expect(resPost.status).toBe(201);
    const post: { id: number; title: string; content: string; cover_image: string } = await resPost.json();
    id_post = post.id;
    expect(post.title).toBe('Post test');
    expect(post.content).toBe('Post test content');

    const commentRes = await app.request(`/blog/posts/${id_post}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        content: 'Test comment for reporting',
      }),
    });
    expect(commentRes.status).toBe(201);
    const comment = await commentRes.json();
    id_comment = comment.id;
  });

  test('Create report for post', async () => {
    const res = await app.request(`/reports/posts/${id_post}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        id_reason: 2,
        content: 'This post is inappropriate',
      }),
    });
    expect(res.status).toBe(201);
    const report = await res.json();
    expect(report).toHaveProperty('id');
    expect(report).toHaveProperty('id_post', id_post);
    expect(report).toHaveProperty('content', 'This post is inappropriate');
    id_report = report.id;
  });

  test('Get reports for post', async () => {
    const res = await app.request(`/reports/posts/${id_post}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const response = await res.json();
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('count');
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('Create report for comment', async () => {
    const res = await app.request(`/reports/comments/${id_comment}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        id_reason: 2,
        content: 'This comment is spam',
      }),
    });
    expect(res.status).toBe(201);
    const report = await res.json();
    expect(report).toHaveProperty('id');
    expect(report).toHaveProperty('content', 'This comment is spam');
  });

  test('Get reports for comment', async () => {
    const res = await app.request(`/reports/comments/${id_comment}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const response = await res.json();
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('count');
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('Delete report', async () => {
    const res = await app.request(`/reports/${id_report}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
    const response = await res.json();
    expect(response).toHaveProperty('message');
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
