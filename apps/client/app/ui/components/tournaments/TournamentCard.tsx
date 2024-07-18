import type { Tournament } from '@/app/(withNavbar)/tournaments/page';
import { User, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function TournamentCard({ tournament, member }: { tournament: Tournament; member: boolean }) {
  return (
    <div className="h-44 p-4 shadow-lg">
      <div className="flex gap-6 h-full">
        <div className="relative w-64 h-36">
          <Link
            href={
              member ? `/members/tournaments/details?id=${tournament.id}` : `/tournaments/details?id=${tournament.id}`
            }
          >
            <Image
              className="object-cover"
              width={256}
              height={144}
              src={'/placeholder.jpg'}
              style={{ width: '256px', height: '144px' }}
              alt={'placeholder'}
            />
          </Link>
        </div>
        <div className="h-full max-w-[624px]">
          <Link
            href={
              member ? `/members/tournaments/details?id=${tournament.id}` : `/tournaments/details?id=${tournament.id}`
            }
          >
            <h2 className="truncate cursor-pointer hover:text-slate-400" title={tournament.name}>
              {tournament.name}
            </h2>
          </Link>
          <div>
            <p className="font-extralight text-slate-950 leading-5 h-full line-clamp-4 text-justify">
              {tournament.rules}
            </p>
          </div>
        </div>
        <div className=" flex flex-col justify-end ml-auto">
          <div className="w-full flex justify-end items-center gap-4">
            <div className="flex items-center gap-1 font-medium text-sm">
              <Users />
              {tournament.max_participants} Equipes
            </div>
            <div className="flex items-center gap-1 font-medium text-sm">
              <User />
              {tournament.team_capacity} Joueurs par équipe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentCard;
