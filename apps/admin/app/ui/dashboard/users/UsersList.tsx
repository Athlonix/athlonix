'use client';

import { UserRow } from '@/app/ui/dashboard/users/UserRow';
import { useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id_referer: number;
  date_validity: string;
  roles: { id: number; name: string }[];
};

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const urlApi = process.env.ATHLONIX_API_URL;
    fetch(`${urlApi}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {users.map((user: User) => (
        <UserRow key={user.id} {...user} />
      ))}
    </>
  );
}
