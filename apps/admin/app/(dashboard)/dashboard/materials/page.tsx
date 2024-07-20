'use client';

import type { Address, Material } from '@/app/lib/type/Materials';
import AddMaterial from '@/app/ui/dashboard/materials/AddMaterial';
import AddNewMaterial from '@/app/ui/dashboard/materials/AddNewMaterial';
import DeleteMaterial from '@/app/ui/dashboard/materials/DeleteMaterial';
import EditMaterial from '@/app/ui/dashboard/materials/EditMaterial';
import MaterialsList from '@/app/ui/dashboard/materials/MaterialsList';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import { Input } from '@repo/ui/components/ui/input';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface MaterialData {
  data: Material[];
  count: number;
}

interface AddressData {
  data: Address[];
  count: number;
}

function ShowContent({ addresses }: { addresses: Address[] }): JSX.Element {
  const router = useRouter();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        all: 'true',
      });

      const addressesString = addresses.map((address) => `addresses=${address.id}`).join('&');

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
          setMaterials(data.data);
        })
        .catch((error: Error) => {
          console.error(error);
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
        <h1 className="text-lg font-semibold md:text-2xl">Gestion matériel</h1>
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[336px]"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="value-1">
          <AccordionTrigger>Matériels</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {materials?.map((material) => (
                <div key={material.id} className="grid grid-cols-3">
                  <div>{material.name}</div>
                  <div>{material.weight_grams ? `${material.weight_grams} g` : 'Non renseigné'}</div>
                  <div>
                    <div className="flex w-full justify-end gap-4">
                      <EditMaterial material={material} materials={materials} setMaterials={setMaterials} />
                      <DeleteMaterial material={material} setMaterials={setMaterials} />
                    </div>
                  </div>
                </div>
              ))}
              <AddMaterial materials={materials} setMaterials={setMaterials} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm p-4" x-chunk="dashboard-02-chunk-1">
        <ScrollArea className="w-full">
          <div className="grid w-full">
            <MaterialsList materials={materials} addresses={addresses} setMaterials={setMaterials} />
          </div>
        </ScrollArea>
      </div>
      <AddNewMaterial materials={materials} addresses={addresses} setMaterials={setMaterials} />
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
        console.error(error);
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
