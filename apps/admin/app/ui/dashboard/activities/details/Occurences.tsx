import type { Activity, Occurence, User } from '@/app/lib/type/Activities';
import ValidateUser from '@/app/ui/dashboard/activities/details/ValidateUser';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { CalendarIcon, UserCheckIcon, UserPlusIcon } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

type OccurenceProps = {
  activity: Activity;
  occurences: Occurence[];
  users1: User[];
  users2: User[];
  users3: User[];
  setUsers1: React.Dispatch<React.SetStateAction<User[]>>;
  setUsers2: React.Dispatch<React.SetStateAction<User[]>>;
  setUsers3: React.Dispatch<React.SetStateAction<User[]>>;
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
      <div key={user.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
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

function Occurences({ activity, occurences, users1, users2, users3, setUsers1, setUsers2, setUsers3 }: OccurenceProps) {
  const filteredOccurences = useMemo(() => {
    const now = new Date();
    return occurences
      .filter((occurence) => new Date(occurence.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [occurences]);

  const userSets = [
    { users: users1, setUsers: setUsers1 },
    { users: users2, setUsers: setUsers2 },
    { users: users3, setUsers: setUsers3 },
  ];

  if (filteredOccurences.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune session future n'est prévue pour cette activité.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue={`activity-${filteredOccurences[0]?.date}`} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${filteredOccurences.length}, 1fr)` }}>
        {filteredOccurences.map((occurence) => (
          <TabsTrigger key={occurence.date} value={`activity-${occurence.date}`}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            {formatDate(occurence.date)}
          </TabsTrigger>
        ))}
      </TabsList>
      {filteredOccurences.map((occurence, index) => {
        const { users, setUsers } = userSets[index] || { users: [], setUsers: () => {} };
        const validatedUsers = users.filter((user) => user.active);
        const pendingUsers = users.filter((user) => !user.active);

        if (pendingUsers.length === 0 && validatedUsers.length === 0) {
          return (
            <TabsContent key={occurence.date} value={`activity-${occurence.date}`}>
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
          );
        }

        return (
          <TabsContent key={occurence.date} value={`activity-${occurence.date}`}>
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
                  <p className="text-center text-muted-foreground">Aucun participant pour cette session.</p>
                </CardContent>
                <CardContent>
                  <UserList users={validatedUsers} occurence={occurence} activity={activity} setUsers={setUsers} />
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
                  <UserList users={pendingUsers} occurence={occurence} activity={activity} setUsers={setUsers} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export default Occurences;
