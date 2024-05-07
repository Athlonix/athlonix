import { supAdmin } from '../src/libs/supabase.js';

export async function deleteAdmin(id: number, id_auth: string): Promise<void> {
  const { error } = await supAdmin.from('USERS').delete().eq('id', id);
  console.log('error', error);
  if (error) throw new Error('Error while deleting user');

  const { error: errorAuth } = await supAdmin.auth.admin.deleteUser(id_auth.toString());
  if (errorAuth) throw new Error('Error while deleting admin user');
}

export async function insertRole(id_user: number, id_role: number): Promise<void> {
  const { error } = await supAdmin.from('USERS_ROLES').insert({ id_user, id_role });
  if (error) throw new Error('Error while updating user');
}
