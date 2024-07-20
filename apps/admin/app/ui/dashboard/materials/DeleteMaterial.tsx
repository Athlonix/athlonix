import type { Material } from '@/app/lib/type/Materials';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { toast } from '@repo/ui/components/ui/sonner';
import { CircleX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  material: Material;
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

function DeleteMaterial({ material, setMaterials }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function deleteMaterial() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/materials/${material.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then(async (response) => {
        if (response.status === 403) {
          router.push('/');
        }
        if (response.status !== 200) {
          throw new Error(await response.text());
        }
        return response.json();
      })
      .then(() => {
        toast.success('Matériel supprimé', { duration: 2000, description: 'Le Matériel a été supprimé avec succès' });
        setMaterials((prevMaterials) => prevMaterials.filter((m) => m.id !== material.id));
        setOpen(false);
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 20000, description: error.message });
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <CircleX size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suppression du matériel</DialogTitle>
          <DialogDescription className="mx-5">
            Etes vous sûr de vouloir supprimer le matériel ?
            <div className="flex gap-4 mt-4">
              <Button variant="destructive" className="w-full" onClick={() => deleteMaterial()}>
                Supprimer
              </Button>
              <Button variant="secondary" type="button" onClick={() => setOpen(false)} className="w-full">
                Annuler
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteMaterial;
