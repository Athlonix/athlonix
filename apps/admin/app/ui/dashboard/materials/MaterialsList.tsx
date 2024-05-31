'use client';

import MaterialLocation from '@/app/ui/dashboard/materials/MaterialLocation';
import { Accordion } from '@repo/ui/components/ui/accordion';

type Material = {
  id_address: number;
  quantity: number;
  id: number;
  name: string;
  weight_grams: number | null;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

interface Props {
  materials: Material[];
  addresses: Address[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

function MaterialsList({ materials, addresses, setMaterials }: Props) {
  return (
    <>
      <Accordion type="multiple" className="w-full">
        {addresses.map((address) => (
          <MaterialLocation key={address.id} materials={materials} address={address} setMaterials={setMaterials} />
        ))}
      </Accordion>
    </>
  );
}

export default MaterialsList;
