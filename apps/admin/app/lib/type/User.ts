export type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id_referer: number | null;
  id_auth: string | null;
  date_validity: string | null;
  created_at: string;
  deleted_at: string | null;
  invoice: string | null;
  subscription: string | null;
  status: 'applied' | 'approved' | 'rejected' | null;
  roles: { id: number; name: string }[];
};
