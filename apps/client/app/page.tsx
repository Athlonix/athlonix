import { Button } from '@repo/ui/components/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center gap-y-8">
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

      <section className="flex items-center gap-6 justify-between w-full">
        <div className="flex-1 max-w-[600px]">
          <h1 className="mb-4">Qui sommes nous ?</h1>
          <p className="mb-6">
            Veniam ad anim et esse nulla pariatur. Do est enim dolore laboris. Lorem labore sint consequat ex eu mollit
            est nostrud ad enim. Mollit proident et fugiat do ut labore aliqua quis eu laboris.
          </p>
          <Button asChild className="w-44">
            <Link href="/">Deviens membre !</Link>
          </Button>
        </div>
        <Image className="flex-1 max-w-[496px]" src="/sport_balls.png" alt="sport balls" width={800} height={482} />
      </section>

      <section className="w-full flex items-center justify-center gap-12">
        <div className="flex flex-col gap-2 justify-center bg-secondary p-6 rounded-2xl w-72 h-44">
          <h1>42+</h1>
          <p className="font-normal text-xl">sports présents</p>
        </div>
        <div className="flex flex-col gap-2 justify-center bg-secondary p-6 rounded-2xl w-72 h-44">
          <h1>10000+</h1>
          <p className="font-normal text-xl">adherents inscrits</p>
        </div>
        <div className="flex flex-col gap-2 justify-center bg-secondary p-6 rounded-2xl w-72 h-44">
          <h1>125+</h1>
          <p className="font-normal text-xl">evenements organises</p>
        </div>
      </section>
    </main>
  );
}
