'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Toaster, toast } from '@repo/ui/components/ui/sonner';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import AthlonixBot from '../ui/components/ChatBot';

function ShowToast() {
  const searchParams = useSearchParams();
  const search = searchParams.get('loggedIn');

  useEffect(() => {
    if (search === 'true') {
      toast.info('Bon retour !', { duration: 2000, description: 'Vous êtes connecté !' });
    }
  }, [search]);

  return <Toaster />;
}

export default function Page(): JSX.Element {
  return (
    <>
      <main className="flex flex-col items-center gap-y-8 py-6">
        <section className="flex flex-col gap-y-4">
          <div className="flex gap-8 h-44 items-center justify-center">
            <h1 className="font-semibold text-[144px]">Athlonix</h1>
            <div className="h-[168px] max-w-[720px]">
              <Image
                src="/running_track.jpg"
                alt="running track"
                width={720}
                height={168}
                className="object-cover h-full rounded-tr-[96px]"
              />
            </div>
          </div>

          <div className="flex gap-8 h-44 items-center justify-start flex-nowrap">
            <div className="h-[168px] max-w-[492px]">
              <Image
                src="/ski.jpg"
                alt="ski in mountains"
                width={500}
                height={168}
                className="object-cover h-full rounded-[96px]"
              />
            </div>
            <h1 className="font-normal text-[144px]">Association</h1>
          </div>

          <div className="flex gap-8 h-44 items-center justify-center">
            <h1 className="font-semibold text-[144px]">Multisport</h1>
            <div className="max-w-[545px] h-[168px]">
              <Image
                src="/kayak.jpg"
                alt="kayaks"
                width={720}
                height={168}
                className="object-cover h-full rounded-br-[96px]"
              />
            </div>
          </div>
        </section>

        <section className="flex items-center gap-6 justify-between w-full">
          <div className="flex-1 max-w-[600px]">
            <h1 className="mb-4">Qui sommes nous ?</h1>
            <p className="mb-6">
              Athlonix est une association multisport qui regroupe plus de 42 sports différents. De l'e-sport à la
              musculation en passant par le football, vous trouverez forcément votre bonheur parmi nos activités.
            </p>
            <Button asChild className="w-44">
              <Link href="/">Devenir membre</Link>
            </Button>
            <Button asChild className="w-44 ml-6">
              <Link href="https://donate.stripe.com/test_bIY9E70lS2IW6Ws5kk" target="_blank" rel="noreferrer">
                Faire un don
              </Link>
            </Button>
          </div>
          <div className="max-w-[496px] flex-1">
            <Image className="w-full h-auto" src="/sport_balls.png" alt="sport balls" width={800} height={482} />
          </div>
        </section>

        <section className="w-full flex items-center justify-center gap-12">
          <div className="flex flex-col gap-2 justify-center bg-secondary p-6 rounded-2xl max-w-72 w-full h-44">
            <h1>42+</h1>
            <p className="font-normal text-xl">sports présents</p>
          </div>
          <div className="flex flex-col gap-2 justify-center bg-secondary p-6 rounded-2xl max-w-72 w-full h-44">
            <h1>10000+</h1>
            <p className="font-normal text-xl">adhérents inscrits</p>
          </div>
          <div className="flex flex-col gap-2 justify-center bg-secondary p-6 rounded-2xl max-w-72 w-full h-44">
            <h1>125+</h1>
            <p className="font-normal text-xl">événements organisés</p>
          </div>
        </section>

        <Suspense>
          <ShowToast />
        </Suspense>
        <AthlonixBot />
      </main>
    </>
  );
}
