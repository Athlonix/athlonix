import { HTTPException } from 'hono/http-exception';
import { Role } from '../validators/general.js';

export async function checkRole(user: number, member: boolean, role?: Role[]) {
  if (!user) throw new HTTPException(403, { message: 'No user role found' });

  if (member && user >= Role.MEMBER) return;

  if (user === Role.ADMIN) return;

  if (role?.includes(user)) return;

  throw new HTTPException(403, { message: 'Forbidden' });
}
