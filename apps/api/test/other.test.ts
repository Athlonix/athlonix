import app from '../src/index.js';
import { checkBanned, checkRole } from '../src/utils/context.js';
import { getPagination } from '../src/utils/pagnination.js';

const port = Number(process.env.PORT || 3101);
const path = `http://localhost:${port}`;

describe('Other general tests', () => {
  test('Check health endpoint', async () => {
    const response = await app.request(`${path}/health`);
    expect(response.status).toBe(200);
  });

  test('Check banned user', async () => {
    await expect(checkBanned([1, 2, 3])).rejects.toThrow('Banned user');
    await expect(checkBanned([2, 3, 4, 1])).rejects.toThrow('Banned user');
    await expect(checkBanned([2, 3, 4])).resolves.toBeUndefined();
  });

  test('Check role', async () => {
    await expect(checkRole([1, 2, 3], false, [2, 3])).rejects.toThrow('Banned user');
    await expect(checkRole([2, 3], true)).resolves.toBeUndefined();
    await expect(checkRole([2, 3], false, [2, 4])).resolves.toBeUndefined();
    await expect(checkRole([2, 3], false, [1, 4])).rejects.toThrow('Forbidden');
  });

  test('Validate pagination', () => {
    const pagination = getPagination(1, 10);
    expect(pagination.from).toBe(10);
    expect(pagination.to).toBe(19);
  });
});
