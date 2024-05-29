'use client';

import PaginationComponent from '@/app/ui/Pagination';
import { Input } from '@repo/ui/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type Material = {
  id_address: number;
  quantity: number;
  id: number;
  name: string;
  weight_grams: number | null;
};

type MaterialData = {
  data: Material[];
  count: number;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

type AddressData = {
  data: Address[];
  count: number;
};

function ShowContent({ addresses }: { addresses: Address[] }): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams({
        search: searchTerm,
      });

      const addressesString = addresses.map((address) => `addresses=${address.id}`).join('&');

      console.log(`${urlApi}/materials?${queryParams}&${addressesString}`);

      fetch(`${urlApi}/materials?${queryParams}&${addressesString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => {
          if (response.status === 403) {
            router.push('/');
          }
          return response.json();
        })
        .then((data: MaterialData) => {
          console.log(data.data);
          setMaterials(data.data);
        })
        .catch((error: Error) => {
          console.log(error);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, router, addresses]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-semibold md:text-2xl">Matériel</h1>
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[336px]"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm p-4" x-chunk="dashboard-02-chunk-1">
        <div className="grid grid-cols-2 gap-4 w-full">{/* <PostsList posts={posts} /> */}</div>
      </div>
    </>
  );
}

export default function Page(): JSX.Element {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const queryParams = new URLSearchParams({
      all: 'true',
    });

    fetch(`${urlApi}/addresses?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data: AddressData) => {
        const addressesArray = data.data.map((address) => {
          return {
            id: address.id,
            road: address.road,
            number: address.number,
            complement: address.complement,
            name: address.name,
          };
        });
        setAddresses(addressesArray);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [router]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <Suspense>
        <ShowContent addresses={addresses} />
      </Suspense>
    </main>
  );
}
