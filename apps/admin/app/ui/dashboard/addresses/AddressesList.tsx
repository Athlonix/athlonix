'use client';

import AddressRow from '@/app/ui/dashboard/addresses/AddressRow';

type Address = {
  id: number;
  road: string;
  postal_code: string;
  complement: string | null;
  city: string;
  number: number;
  name: string | null;
  id_lease: number | null;
};

function AddressesList({ addresses }: { addresses: Address[] }) {
  return (
    <>
      {addresses.map((address: Address) => (
        <AddressRow key={address.id} {...address} />
      ))}
    </>
  );
}

export default AddressesList;
