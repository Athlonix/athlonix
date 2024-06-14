import type { Team } from '@/app/lib/type/Tournaments';
import { joinTeam } from '@/app/lib/utils/tournament';
import { Button } from '@repo/ui/components/ui/button';
import { toast } from '@repo/ui/components/ui/sonner';
import { CornerLeftDown } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface JoinTeamProps {
  id_tournament: number;
  team: Team;
  setter: Dispatch<SetStateAction<Team[]>>;
  username: string | undefined;
  setCurrentTeam: Dispatch<SetStateAction<number>>;
}

function JoinTeam(props: JoinTeamProps) {
  async function handleJoinTeam() {
    const { data, status } = await joinTeam({
      id_tournament: props.id_tournament,
      team: props.team,
    });

    if (status === 200) {
      toast.success("Vous avez bien rejoins l'équipe", { duration: 2000 });
      props.setter((teams: Team[]) => {
        return teams.map((team: Team) => {
          if (team.id === props.team.id) {
            return {
              ...team,
              users: [...team.users, { id: 0, username: props.username || '' }],
            };
          }
          return team;
        });
      });
      props.setCurrentTeam(props.team.id);
    } else {
      toast.error('Une erreur est survenue', { duration: 2000 });
    }
  }

  return (
    <Button size="sm" variant="info" className="h-8" onClick={() => handleJoinTeam()}>
      <CornerLeftDown />
    </Button>
  );
}

export default JoinTeam;
