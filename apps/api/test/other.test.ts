import app from '../src/index.js';
import { getOccurences } from '../src/libs/activities.js';
import { accountRolesValidity } from '../src/middlewares/auth.js';
import { checkBanned, checkRole } from '../src/utils/context.js';
import { getPagination } from '../src/utils/pagnination.js';


describe('Other general tests', () => {
  test('Check health endpoint', async () => {
    const response = await app.request('/health');
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

  test('Check accountRolesValidity', () => {
    expect(accountRolesValidity(null, [])).toEqual([]);
    expect(accountRolesValidity('2022-01-01', [])).toEqual([]);
    expect(accountRolesValidity('2022-01-01', [{ id_role: 2 }])).toEqual([]);
    const valid_date = new Date();
    valid_date.setFullYear(valid_date.getFullYear() + 1);
    expect(accountRolesValidity(valid_date.toISOString(), [{ id_role: 2 }])).toEqual([2]);
    expect(accountRolesValidity(valid_date.toISOString(), [{ id_role: 2 }, { id_role: 3 }])).toEqual([2, 3]);
  });

  test('Check getOccurences', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-01-10');
    const daysToFind = ['monday', 'wednesday', 'friday'];
    const exceptions = [
      {
        date: '2022-01-03',
        id: 1,
        id_activity: 1,
        max_participants: 10,
        min_participants: 5,
      },
    ];
    const occurences = getOccurences(startDate, endDate, daysToFind, exceptions);
    expect(occurences).toEqual([
      {
        id_exception: 1,
        date: new Date('2022-01-03'),
        max_participants: 10,
        min_participants: 5,
      },
      {
        id_exception: null,
        date: new Date('2022-01-05'),
        max_participants: null,
        min_participants: null,
      },
      {
        id_exception: null,
        date: new Date('2022-01-07'),
        max_participants: null,
        min_participants: null,
      },
      {
        id_exception: null,
        date: new Date('2022-01-10'),
        max_participants: null,
        min_participants: null,
      },
    ]);

    const invalid = getOccurences(new Date('2022-01-10'), new Date('2022-01-01'), daysToFind, exceptions);
    expect(invalid).toEqual([]);
  });
});
