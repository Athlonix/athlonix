'use server';
import { Button } from '@repo/ui/components/ui/button';

export default async function DonationPage(): Promise<JSX.Element> {
  return (
    <section className="w-full py-20 md:py-32 bg-gray-100 dark:bg-gray-800 rounded-3xl">
      <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Aider Athlonix</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Nous sommes une organisation à but non lucratif qui a pour objectif de promouvoir l'amour du sport et de
            l'activité physique. Nous avons besoin de votre aide pour continuer à fournir des services de qualité à nos
            membres.
          </p>
          <Button className="bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90">
            <a href="https://donate.stripe.com/test_bIY9E70lS2IW6Ws5kk" target="_blank" rel="noreferrer">
              Donner maintenant
            </a>
          </Button>
        </div>
        <img
          alt="Donation Cause"
          className="mx-auto rounded-xl"
          height="400"
          src="https://picsum.photos/600/400"
          style={{
            aspectRatio: '600/400',
            objectFit: 'cover',
          }}
          width="600"
        />
      </div>
    </section>
  );
}
