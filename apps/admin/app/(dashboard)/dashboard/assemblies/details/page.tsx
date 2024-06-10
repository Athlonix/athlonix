'use client';

import { type Assembly, getAssembly } from '@/app/(dashboard)/dashboard/assemblies/utils';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AssemblyDetail(): JSX.Element {
  const searchParams = useSearchParams();
  const idPoll = searchParams.get('id');
  const [assembly, setAssembly] = useState<Assembly | null>(null);

  useEffect(() => {
    const fetchAssembly = async () => {
      const data = await getAssembly(Number(idPoll));
      setAssembly(data);
    };
    fetchAssembly();
  }, [idPoll]);

  return (
    <>
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-semibold md:text-2xl">Assemblée Générale: {assembly?.name}</h1>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm p-4" x-chunk="dashboard-02-chunk-1">
        <div className="grid gap-4 w-full">
          <div className="flex justify-center flex-col gap-4 p-4">
            <div>
              <div>{assembly?.name}</div>
              <div>{assembly?.date}</div>
              <div>{assembly?.location}</div>
              <div>{assembly?.description}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
