import { z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { describe, vi } from 'vitest';
import app from '../src/index.js';
import { getOccurencesMonthly, getOccurencesWeekly, getOccurencesYearly } from '../src/libs/activities.js';
import { zodErrorHook } from '../src/libs/zodError.js';
import { accountRolesValidity } from '../src/middlewares/auth.js';
import { checkBanned, checkRole } from '../src/utils/context.js';
import { getPagination } from '../src/utils/pagnination.js';

const mockJson = vi.fn();
const mockContext = {
  json: mockJson,
} as unknown as Context;

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
    const occurences = getOccurencesWeekly(startDate, endDate, daysToFind, exceptions);
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

    const invalid = getOccurencesWeekly(new Date('2022-01-10'), new Date('2022-01-01'), daysToFind, exceptions);
    expect(invalid).toEqual([]);
  });

  test('Check getOccurencesMonthly', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-01-31');
    const exceptions = [
      {
        date: '2022-01-03',
        id: 1,
        id_activity: 1,
        max_participants: 10,
        min_participants: 5,
      },
    ];
    const occurences = getOccurencesMonthly(startDate, endDate, exceptions);
    expect(occurences).toEqual([
      {
        id_exception: null,
        date: new Date('2022-01-01'),
        max_participants: null,
        min_participants: null,
      },
    ]);

    const invalid = getOccurencesMonthly(new Date('2022-01-31'), new Date('2022-01-01'), exceptions);
    expect(invalid).toEqual([]);
  });

  test('Check getOccurencesYearly', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-12-31');
    const exceptions = [
      {
        date: '2022-01-03',
        id: 1,
        id_activity: 1,
        max_participants: 10,
        min_participants: 5,
      },
    ];
    const occurences = getOccurencesYearly(startDate, endDate, exceptions);
    expect(occurences).toEqual([
      {
        date: new Date('2022-01-01'),
        id_exception: null,
        max_participants: null,
        min_participants: null,
      },
    ]);

    const invalid = getOccurencesYearly(new Date('2022-12-31'), new Date('2022-01-01'), exceptions);
    expect(invalid).toEqual([]);
  });

  // Zod error hook
  it('should return undefined when result is successful', () => {
    const result = { success: true, data: 'some data' };
    expect(zodErrorHook(result, mockContext)).toBeUndefined();
    expect(mockJson).not.toHaveBeenCalled();
  });

  it('should return a 400 response with error message when there is a Zod error', () => {
    const schema = z.object({ name: z.string() });
    const result = {
      success: false,
      error: schema.safeParse({ name: 123 }).error,
    };

    zodErrorHook(result, mockContext);

    expect(mockJson).toHaveBeenCalledWith({ error: expect.any(String) }, 400);
    expect(mockJson?.mock.calls[0]?.[0]?.error).toContain('Expected string');
  });

  it('should return a 500 response when there is no specific error', () => {
    const result = { success: false };

    zodErrorHook(result, mockContext);

    expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' }, 500);
  });
});
