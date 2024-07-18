import type { Team } from '@/app/lib/type/Tournaments';
import { leaveTeam } from '@/app/lib/utils/tournament';
import { Button } from '@repo/ui/components/ui/button';
import { toast } from '@repo/ui/components/ui/sonner';
import { CornerLeftUp } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface LeaveTeamProps {
  id_tournament: number;
  team: Team;
  setter: Dispatch<SetStateAction<Team[]>>;
  username: string | undefined;
  setCurrentTeam: Dispatch<SetStateAction<number>>;
}

function LeaveTeam(props: LeaveTeamProps) {
  async function handleLeaveTeam() {
    const { data, status } = await leaveTeam({
      id_tournament: props.id_tournament,
      team: props.team,
    });

    if (status === 200) {
      toast.success("Vous avez bien quitté l'équipe", { duration: 2000 });
      props.setter((teams: Team[]) => {
        return teams
          .map((team: Team) => {
            if (team.id === props.team.id) {
              return {
                ...team,
                users: team.users.filter((user) => user.username !== props.username),
              };
            }
            return team;
          })
          .filter((team) => team.users.length > 0);
      });
      props.setCurrentTeam(0);
    } else {
      toast.error('Une erreur est survenue', { duration: 2000 });
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      className="h-8"
      onClick={() => handleLeaveTeam()}
      title="Quitter l'équipe"
      aria-label="Quitter l'équipe"
    >
      <CornerLeftUp />
    </Button>
  );
}

export default LeaveTeam;
