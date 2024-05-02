'use client';

import UserRow from '@/app/ui/dashboard/users/UserRow';

type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id_referer: number | null;
  date_validity: string | null;
  roles: { id: number; name: string }[];
};

function UsersList({ users }: { users: User[] }) {
  return (
    <>
      {users.map((user: User) => (
        <UserRow key={user.id} {...user} />
      ))}
    </>
  );
}

export default UsersList;
