'use client';

import type { User } from '@/app/(dashboard)/dashboard/users/page';
import UserRow from '@/app/ui/dashboard/users/UserRow';

function UsersList({ users }: { users: User[] }) {
  return (
    <>
      {users?.map((user: User) => (
        <UserRow key={user.id} {...user} />
      ))}
    </>
  );
}

export default UsersList;
