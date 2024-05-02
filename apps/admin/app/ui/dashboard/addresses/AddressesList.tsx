'use client';

import AddressRow from '@/app/ui/dashboard/addresses/AddressRow';

type Address = {
  id: number;
  road: string;
  postal_code: string;
  complement: string;
  city: string;
  number: number;
  name: string;
  id_lease: number;
};

function UsersList({ addresses }: { addresses: Address[] }) {
  return (
    <>
      {addresses.map((address: Address) => (
        <AddressRow key={address.id} {...address} />
      ))}
    </>
  );
}

export default UsersList;
