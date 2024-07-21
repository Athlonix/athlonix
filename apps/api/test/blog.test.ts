import fs from 'node:fs';
import path from 'node:path';
import app from '../src/index.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Blog tests', () => {
  let id_user: number;
  let id_auth: string;
  let jwt: string;
  let id_post: number;
  let id_comment: number;
  let postImage: string;

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

  describe('Post operations', () => {
    test('Create post', async () => {
      const formData = new FormData();
      formData.append('title', 'Post test');
      formData.append('description', 'Post test description');
      formData.append('content', 'Post test content');

      const imagePath = path.join(__dirname, 'files', 'mock_image.png');
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
      formData.append('cover_image', imageBlob, 'mock_image.png');

      const res = await app.request('/blog/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      expect(res.status).toBe(201);
      const post: { id: number; title: string; content: string; cover_image: string } = await res.json();
      id_post = post.id;
      postImage = post.cover_image;
      expect(post.title).toBe('Post test');
      expect(post.content).toBe('Post test content');
    });

    test('Get post', async () => {
      const res = await app.request(`/blog/posts/${id_post}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(res.status).toBe(200);
      const post: { title: string; content: string; cover_image: string; description: string } = await res.json();
      expect(post).toMatchObject({
        title: 'Post test',
        content: 'Post test content',
        cover_image: postImage,
        description: 'Post test description',
      });
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
      const updatedPost: { title: string; content: string } = await res.json();
      expect(updatedPost.title).toBe('Post test updated');
      expect(updatedPost.content).toBe('Post test content updated');
    });

    test('Get all posts', async () => {
      const res = await app.request('/blog/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(res.status).toBe(200);
      const postsResponse: { data: { title: string; content: string }[]; count: number } = await res.json();
      expect(Array.isArray(postsResponse.data)).toBeTruthy();
      expect(typeof postsResponse.count).toBe('number');
      expect(postsResponse.data.length).toBeGreaterThan(0);
    });

    test('Attempt to create post without authentication', async () => {
      const res = await app.request('/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Unauthorized post',
          content: 'This should not be created',
        }),
      });
      expect(res.status).toBe(401);
    });

    test('Attempt to update non-existent post', async () => {
      const res = await app.request('/blog/posts/99999', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          title: 'Non-existent post',
        }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('Comment operations', () => {
    test('Comment on the post', async () => {
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
      const comment: { id: number; content: string } = await res.json();
      id_comment = comment.id;
      expect(comment.content).toBe('Comment test');
    });

    test('Get comments', async () => {
      const res = await app.request(`/blog/posts/${id_post}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(res.status).toBe(200);
      const comments: { data: Comment[]; count: number } = await res.json();
      expect(Array.isArray(comments.data)).toBeTruthy();
      expect(typeof comments.count).toBe('number');
      expect(comments.data.length).toBeGreaterThan(0);
    });

    test('Update comment', async () => {
      const res = await app.request(`/blog/posts/${id_post}/comments/${id_comment}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          content: 'Updated comment',
        }),
      });
      expect(res.status).toBe(200);
      const updatedComment: { content: string } = await res.json();
      expect(updatedComment.content).toBe('Updated comment');
    });

    test('Attempt to comment without authentication', async () => {
      const res = await app.request(`/blog/posts/${id_post}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Unauthorized comment',
        }),
      });
      expect(res.status).toBe(401);
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

    test('Attempt to delete non-existent comment', async () => {
      const res = await app.request(`/blog/posts/${id_post}/comments/99999`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
      expect(res.status).toBe(404);
    });
  });

  describe('Post responses', () => {
    let id_response: number;

    test('Create response to a comment', async () => {
      const commentRes = await app.request(`/blog/posts/${id_post}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          content: 'Parent comment',
        }),
      });
      expect(commentRes.status).toBe(201);
      const comment: { id: number; content: string } = await commentRes.json();

      const res = await app.request(`/blog/posts/${id_post}/comments/${comment.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          content: 'Response to comment',
        }),
      });
      expect(res.status).toBe(201);
      const response: { id: number; content: string } = await res.json();
      id_response = response.id;
      expect(response.content).toBe('Response to comment');
    });

    test('Get responses for a comment', async () => {
      const res = await app.request(`/blog/posts/${id_post}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(res.status).toBe(200);
      const comments: { data: { id: number; content: string }[] } = await res.json();
      expect(comments.data.some((comment) => comment.id === id_response)).toBeTruthy();
    });

    test('Update response', async () => {
      const res = await app.request(`/blog/posts/${id_post}/comments/${id_response}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          content: 'Updated response',
        }),
      });
      expect(res.status).toBe(200);
      const updatedResponse: { content: string } = await res.json();
      expect(updatedResponse.content).toBe('Updated response');
    });

    test('Delete response', async () => {
      const res = await app.request(`/blog/posts/${id_post}/comments/${id_response}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
      expect(res.status).toBe(200);
    });
  });

  test('Soft delete post', async () => {
    const res = await app.request(`/blog/posts/${id_post}/soft`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    expect(res.status).toBe(200);
  });

  test('Full delete post', async () => {
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
