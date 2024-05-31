import AddMaterialLocation from '@/app/ui/dashboard/materials/AddMaterialLocation';
import DeleteMaterialLocation from '@/app/ui/dashboard/materials/DeleteMaterialLocation';
import EditMaterialLocation from '@/app/ui/dashboard/materials/EditMaterialLocation';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import type React from 'react';

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
  address: Address;
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

function MaterialLocation({ materials, address, setMaterials }: Props) {
  const materialsFiltered = materials.filter((material) => material.id_address === address.id);
  if (materialsFiltered.length === 0) return null;
  return (
    <AccordionItem value={`value-${address.id}`}>
      <AccordionTrigger>
        {address.name
          ? `${address.name} (${materialsFiltered.length})`
          : `${address.number}, ${address.road} (${materialsFiltered.length})`}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col space-y-2">
          {materialsFiltered.map((material) => (
            <div key={material.id} className="grid grid-cols-4">
              <div>{material.name}</div>
              <div>
                {material.weight_grams
                  ? `${material.weight_grams / 1000} kg (${material.weight_grams} g/u)`
                  : 'Non renseigné'}
              </div>
              <div>{material.quantity} unité(s)</div>
              <div className="flex w-full justify-end gap-4">
                <EditMaterialLocation material={material} materials={materials} setMaterials={setMaterials} />
                <DeleteMaterialLocation material={material} setMaterials={setMaterials} />
              </div>
            </div>
          ))}
          <AddMaterialLocation materials={materials} id_address={address.id} setMaterials={setMaterials} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default MaterialLocation;
