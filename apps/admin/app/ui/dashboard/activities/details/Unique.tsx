import type { Activity, Occurence, User } from '@/app/lib/type/Activities';
import ValidateUser from '@/app/ui/dashboard/activities/details/ValidateUser';
import { Avatar, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { CalendarIcon, UserCheckIcon, UserPlusIcon } from 'lucide-react';
import type React from 'react';

type OccurenceProps = {
  activity: Activity;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const UserList = ({
  users,
  occurence,
  activity,
  setUsers,
}: {
  users: User[];
  occurence: Occurence;
  activity: Activity;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) => (
  <ScrollArea className="h-[300px]">
    {users.map((user) => (
      <div key={user.id} className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{user.username}</span>
        </div>
        {user.active ? (
          <Badge variant="success" className="text-xs ml-4">
            Validé
          </Badge>
        ) : (
          <ValidateUser user={user} setUser={setUsers} id_activity={activity.id} date={occurence.date} />
        )}
      </div>
    ))}
  </ScrollArea>
);

function Occurences({ activity, users, setUsers }: OccurenceProps) {
  const validatedUsers = users.filter((user) => user.active);
  const pendingUsers = users.filter((user) => !user.active);

  const fake_occurence = {
    id_activity: activity.id,
    date: `${activity.start_date}T00:00:00`,
    max_participants: activity.max_participants,
    min_participants: activity.min_participants,
  };

  return (
    <Tabs defaultValue={'activity'} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
        <TabsTrigger value={'activity'}>
          <CalendarIcon className="w-4 h-4 mr-2" />
          {formatDate(new Date(`${activity.start_date}T00:00:00`).toISOString())}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={'activity'}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <UserCheckIcon className="w-5 h-5 mr-2" />
                Participants
              </span>
              <Badge variant="secondary">
                {validatedUsers.length}/{activity.max_participants}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Aucun participants inscrit pour cette session pour le moment.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value={'activity'}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <UserCheckIcon className="w-5 h-5 mr-2" />
                  Participants
                </span>
                <Badge variant="secondary">
                  {validatedUsers.length}/{activity.max_participants}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserList users={validatedUsers} occurence={fake_occurence} activity={activity} setUsers={setUsers} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <UserPlusIcon className="w-5 h-5 mr-2" />
                  En attente
                </span>
                <Badge variant="secondary">{pendingUsers.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserList users={pendingUsers} occurence={fake_occurence} activity={activity} setUsers={setUsers} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default Occurences;
