import { HTTPException } from 'hono/http-exception';
import { Role } from '../validators/general.js';

export async function checkRole(user: number[], member: boolean, roles?: Role[]) {
  if (!user) throw new HTTPException(403, { message: 'No user role found' });

  if (member && user.includes(Role.MEMBER)) return;

  if (user.includes(Role.ADMIN) || user.includes(Role.DIRECTOR)) return;

  if (roles?.some((role) => user.includes(role))) return;

  throw new HTTPException(403, { message: 'Forbidden' });
}
