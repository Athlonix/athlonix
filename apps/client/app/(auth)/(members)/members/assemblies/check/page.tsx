'use client';

import { Button } from '@ui/components/ui/button';
import { toast } from '@ui/components/ui/sonner';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkIfMemberIsConfirmed, confirmMemberPresence } from './utils';

export default function CheckPage() {
  const [code, setCode] = useState<string>('');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        setCode(code);
        const res = await checkIfMemberIsConfirmed(code);
        if (res) {
          setConfirmed(true);
        }
      }
    }
    fetchData();
  }, []);

  async function handleConfirmPresence() {
    const res = await confirmMemberPresence(code);
    if (!res) {
      toast.error('Erreur lors de la confirmation de votre présence');
      return;
    }
    setConfirmed(true);
    toast.success('Votre présence a été confirmée');
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {confirmed && (
        <>
          <div className="flex items-center justify-center">
            <h2 className="mt-4 text-green-500">Votre présence a été confirmée !</h2>
            <Check className="ml-2" color="green-500" size="24" />
          </div>
          <p className="mt-4">Vous pouvez fermer cette page.</p>
          <Link href="/">
            <Button type="button" className="mt-4">
              Retour à l'accueil
            </Button>
          </Link>
        </>
      )}
      {!confirmed && (
        <>
          <h1>Veuillez confirmer votre présence</h1>
          <Button onClick={() => handleConfirmPresence()} type="button" className="mt-4">
            Confirmer
          </Button>
        </>
      )}
    </div>
  );
}
