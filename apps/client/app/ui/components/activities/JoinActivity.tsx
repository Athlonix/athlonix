import type { User } from '@/app/lib/type/Activities';
import { Button } from '@ui/components/ui/button';
import { toast } from '@ui/components/ui/sonner';
import { Check } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

function JoinActivity({
  id_activity,
  date,
}: {
  id_activity: number;
  date: string;
}) {
  return (
    <Button size="sm" variant="success" className="h-8 gap-1">
      <Check />
    </Button>
  );
}

export default JoinActivity;
