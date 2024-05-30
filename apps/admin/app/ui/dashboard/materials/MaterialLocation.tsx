import EditMaterialLocation from '@/app/ui/dashboard/materials/EditMaterialLocation';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import { Button } from '@repo/ui/components/ui/button';
import { CircleX, Menu } from 'lucide-react';
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
  if (!materials.length) {
    return null;
  }
  return (
    <AccordionItem value={`value-${address.id}`}>
      <AccordionTrigger>
        {address.name
          ? `${address.name} (${materials.length})`
          : `${address.number}, ${address.road} (${materials.length})`}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col space-y-2">
          {materials.map((material) => (
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
                <Button size="sm" variant="destructive">
                  <CircleX size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default MaterialLocation;
