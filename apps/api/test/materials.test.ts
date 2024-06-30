import app from '../src/index.js';
import { supabase } from '../src/libs/supabase.js';
import { Role } from '../src/validators/general.js';
import { deleteAdmin, insertRole, setValidSubscription } from './utils.js';

describe('Material Endpoints', () => {
  let id_user: number;
  let id_auth: string;
  let authToken: string;
  let testMaterialId: number;
  let testAddressId: number;

  beforeAll(async () => {
    const res = await app.request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'mats',
        last_name: 'mats',
        username: 'mats',
        email: 'mats@gmail.com',
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
        email: 'mats@gmail.com',
        password: 'password123456',
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginUser: { token: string } = await loginRes.json();
    authToken = loginUser.token;

    const loc = await app.request('/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
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
    expect(loc.status).toBe(201);
    const location: { id: number } = await loc.json();
    testAddressId = location.id;
  });

  afterAll(async () => {
    await deleteAdmin(id_user, id_auth);
    await supabase.from('ADDRESSES').delete().eq('id', testAddressId);
  });

  describe('POST /materials', () => {
    it('should create a new material', async () => {
      const res = await app.request('/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Test Material',
          weight_grams: 100,
        }),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.name).toBe('Test Material');
      expect(body.weight_grams).toBe(100);
      testMaterialId = body.id;
    });

    it('Should add a material to an address', async () => {
      const res = await app.request(`/materials/${testMaterialId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id_address: testAddressId,
          quantity: 10,
        }),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.message).toBeDefined();
    });

    it('should return 404 when trying to add a non-existent material', async () => {
      const res = await app.request('/materials/99999/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id_address: testAddressId,
          quantity: 10,
        }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /materials', () => {
    it('should get all materials', async () => {
      const res = await app.request(`/materials?all=true&addresses=${testAddressId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.data)).toBe(true);
      expect(typeof body.count).toBe('number');
    });

    it('should filter materials by search term', async () => {
      const res = await app.request(`/materials?search=test&false=true&addresses=${testAddressId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('GET /materials/{id}', () => {
    it('should get a specific material', async () => {
      const res = await app.request(`/materials/${testMaterialId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(testMaterialId);
      expect(body.name).toBe('Test Material');
    });

    it('should return 404 for non-existent material', async () => {
      const res = await app.request('/materials/99999', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /materials/{id}', () => {
    it('should update a material', async () => {
      const res = await app.request(`/materials/${testMaterialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Updated Test Material',
          weight_grams: 200,
        }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.name).toBe('Updated Test Material');
      expect(body.weight_grams).toBe(200);
    });
  });

  describe('PATCH /materials/{id}/quantity', () => {
    it('should change the quantity of a material', async () => {
      const res = await app.request(`/materials/${testMaterialId}/quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          quantity: 10,
          id_address: testAddressId,
        }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBeDefined();
    });
  });

  describe('DELETE /materials/{id}/remove', () => {
    it('should remove a material from an address', async () => {
      const res = await app.request(`/materials/${testMaterialId}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id_address: testAddressId,
        }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBeDefined();
    });

    it('should return 404 when trying to remove a non-existent material', async () => {
      const res = await app.request('/materials/99999/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id_address: testAddressId,
        }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /materials/{id}', () => {
    it('should delete a material', async () => {
      const res = await app.request(`/materials/${testMaterialId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBeDefined();
    });

    it('should return 404 when trying to delete a non-existent material', async () => {
      const res = await app.request(`/materials/${testMaterialId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect(res.status).toBe(404);
    });
  });
});
