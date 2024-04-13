import { Button } from '@repo/ui/components/button';
import Image from 'next/image';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center">
      <section className="flex flex-col max-w-7xl gap-y-4">
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
            src="/ski.jpg"
            alt="ski in mountains"
            width={500}
            height={168}
            className="object-cover max-h-[168px] max-w-[492px] rounded-[96px]"
          />
          <h1 className="font-normal text-[144px] ">Association</h1>
        </div>

        <div className="flex gap-8 h-44 items-center justify-center">
          <h1 className="font-semibold text-[144px]">Multisport</h1>
          <Image
            src="/kayak.jpg"
            alt="kayaks"
            width={720}
            height={168}
            className="object-cover max-h-[168px] max-w-[545px] rounded-br-[96px]"
          />
        </div>
      </section>
    </main>
  );
}
