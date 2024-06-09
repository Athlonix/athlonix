import { Button } from '@repo/ui/components/ui/button';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Statistiques d'Athlonix</h1>
      </div>
    </main>
  );
}
