import type { User } from '@/app/lib/type/Activities';
import { joinActivity } from '@/app/lib/utils/activities';
import { Button } from '@ui/components/ui/button';
import { toast } from '@ui/components/ui/sonner';
import type { Dispatch, SetStateAction } from 'react';

function JoinActivity({
  id_activity,
  date,
  user,
  setPendingJoin,
}: {
  id_activity: number;
  date: string;
  user: User;
  setPendingJoin: Dispatch<SetStateAction<User | undefined>>;
}) {
  function handleJoinActivity() {
    joinActivity(id_activity, date).then((res) => {
      if (res.status === 201) {
        toast.success('Votre demande a bien été envoyée', { duration: 2000 });
        setPendingJoin(user);
      } else {
        toast.error("Une erreur est survenue lors de l'envoi de votre demande", { duration: 2000 });
      }
    });
  }

  return (
    <Button onClick={handleJoinActivity} size="sm" variant="success" className="h-8 gap-1">
      Demander à participer
    </Button>
  );
}

export default JoinActivity;
