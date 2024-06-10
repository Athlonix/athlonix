import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicAssemblyDetail = dynamic(() => import('./assembly'), { ssr: false });

export default function page(): JSX.Element {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <Suspense fallback={<div>Chargement...</div>}>
        <DynamicAssemblyDetail />
      </Suspense>
    </main>
  );
}
