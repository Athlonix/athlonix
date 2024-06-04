export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription: string | null;
  status: 'applied' | 'approved' | 'rejected' | null;
  date_validity: string | null;
}

export async function getUserInfo(): Promise<User> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  const user = await response.json();
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

export function checkSubscription(user: User): null | 'applied' | 'approved' | 'rejected' {
  if (user.status === null) {
    return null;
  }

  if (user.status === 'applied') {
    return 'applied';
  }

  if (user.status === 'rejected') {
    return 'rejected';
  }

  if (user.date_validity === null || new Date(user.date_validity) < new Date()) {
    return null;
  }

  return 'approved';
}

export function getUserAvatar(): string {
  const user = JSON.parse(localStorage.getItem('user') as string) as User;
  if (!user) {
    return '';
  }
  return user?.username.charAt(0).toUpperCase();
}
