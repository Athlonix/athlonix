import { Button } from '@repo/ui/components/button';
import Image from 'next/image';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center">
      <section className="flex flex-col max-w-6xl gap-y-4">
        <div className="flex gap-8 h-44 items-center justify-center">
          <h1 className="font-semibold text-[144px]">Athlonix</h1>
          <Image
            src="/running_track.jpg"
            alt="running track"
            width={720}
            height={168}
            className="object-cover max-h-[168px] max-w-[720px] rounded-tr-[96px]"
          />
        </div>

        <div className="flex gap-8 h-44 items-center justify-start flex-nowrap">
          <Image
            src="/running_track.jpg"
            alt="running track"
            width={720}
            height={168}
            className="object-cover max-h-[168px] w-1/3 "
          />
          <h1 className="font-normal text-[144px] ">Association</h1>
        </div>
      </section>
    </main>
  );
}
