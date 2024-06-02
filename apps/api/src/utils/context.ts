import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { Role } from '../validators/general.js';

export async function checkRole(user: number[], member: boolean, roles?: Role[]) {
  if (!user) throw new HTTPException(403, { message: 'No user role found' });

  if (user.includes(Role.BANNED)) throw new HTTPException(403, { message: 'Banned user' });

  if (user.includes(Role.ADMIN) || user.includes(Role.DIRECTOR)) return;

  if (member && user.includes(Role.MEMBER)) return;

  if (roles?.some((role) => user.includes(role))) return;

  throw new HTTPException(403, { message: 'Forbidden' });
}

// Same as checkRole but without the member check since some routes don't need it
export async function checkBanned(user: number[]) {
  if (!user) throw new HTTPException(403, { message: 'No user role found' });

  if (user.includes(Role.BANNED)) throw new HTTPException(403, { message: 'Banned user' });
}

export function getToken(c: Context) {
  const headerToken = c.req.header('authorization')?.split(' ')[1];
  const cookieToken = getCookie(c, 'access_token');

  const token = headerToken || cookieToken;
  if (!token) throw new HTTPException(401, { message: 'Unauthorized' });

  return token;
}
