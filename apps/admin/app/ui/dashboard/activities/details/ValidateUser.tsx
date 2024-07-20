import type { User } from '@/app/lib/type/Activities';
import { validateUsers } from '@/app/lib/utils/activities';
import { Button } from '@ui/components/ui/button';
import { toast } from '@ui/components/ui/sonner';
import { PlusCircleIcon } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

function ValidateUser({
  id_activity,
  user,
  date,
  setUser,
}: {
  id_activity: number;
  user: User;
  date: string;
  setUser: Dispatch<SetStateAction<User[]>>;
}) {
  async function handleJoinTeam() {
    const { data, status } = await validateUsers(id_activity, user.id, date);
    if (status === 200) {
      setUser((prev) => prev.map((u) => (u.id === user.id ? { ...u, active: true } : u)));
      toast.success("L'utilisateur a bien été validé", { duration: 2000 });
    } else {
      toast.error("L'utilisateur n'a pas pu être validé", { duration: 2000 });
    }
  }
  return (
    <Button onClick={handleJoinTeam} size="sm" variant="success" className="h-8 gap-1 ml-2">
      <PlusCircleIcon size={16} />
    </Button>
  );
}

export default ValidateUser;
