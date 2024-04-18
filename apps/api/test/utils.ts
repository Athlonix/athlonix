import { supAdmin } from '../src/libs/supabase.js';

export const testAdmin = {
  first_name: 'admin',
  last_name: 'admin',
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'password123456',
};

export async function deleteAdmin(id: number, id_auth: string) {
  const { error } = await supAdmin.from('USERS').delete().eq('id', id);
  if (error) {
    console.error('Error while deleting user');
    throw new Error('Error while deleting user');
  }
  const { error: errorAuth } = await supAdmin.auth.admin.deleteUser(id_auth.toString());
  if (errorAuth) {
    throw new Error('Error while deleting admin user');
  }
}
