'use client';

import type { Address, Material } from '@/app/lib/type/Materials';
import MaterialLocation from '@/app/ui/dashboard/materials/MaterialLocation';
import { Accordion } from '@repo/ui/components/ui/accordion';

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
