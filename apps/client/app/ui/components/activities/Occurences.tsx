import type { Activity, Occurence, User } from '@/app/lib/type/Activities';
import JoinActivity from '@/app/ui/components/activities/JoinActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Separator } from '@ui/components/ui/separator';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

function Occurences({
  activity,
  occurences,
  users1,
  users2,
  users3,
  setUsers1,
  setUsers2,
  setUsers3,
}: {
  activity: Activity;
  occurences: Occurence[];
  users1: User[];
  users2: User[];
  users3: User[];
  setUsers1: Dispatch<SetStateAction<User[]>>;
  setUsers2: Dispatch<SetStateAction<User[]>>;
  setUsers3: Dispatch<SetStateAction<User[]>>;
}) {
  const user = localStorage.getItem('user');
  let userId = 0;
  if (user) {
    userId = JSON.parse(user).id;
  }
  console.log('userId', userId);
  const validatedUser1 = users1.filter((user) => user.active === true);
  const validatedUser2 = users2.filter((user) => user.active === true);
  const validatedUser3 = users3.filter((user) => user.active === true);

  const [pendingJoin1, setPendingJoin1] = useState(users1.find((user) => user.id === userId && user.active === false));
  const [pendingJoin2, setPendingJoin2] = useState(users2.find((user) => user.id === userId && user.active === false));
  const [pendingJoin3, setPendingJoin3] = useState(users3.find((user) => user.id === userId && user.active === false));

  const [joined1, setJoined1] = useState(users1.find((user) => user.id === userId && user.active === true));
  const [joined2, setJoined2] = useState(users2.find((user) => user.id === userId && user.active === true));
  const [joined3, setJoined3] = useState(users3.find((user) => user.id === userId && user.active === true));

  console.log('pendingJoin1', pendingJoin1);
  console.log('joined1', joined1);

  return (
    <Tabs defaultValue="activity1">
      <div className="flex justify-center my-4">
        <TabsList>
          {occurences[0] && (
            <TabsTrigger value="activity1">{`${new Date(occurences[0]?.date).getDate().toString().padStart(2, '0')}/${(new Date(occurences[0]?.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(occurences[0]?.date).getFullYear().toString().padStart(2, '0')}`}</TabsTrigger>
          )}
          {occurences[1] && (
            <TabsTrigger value="activity2">{`${new Date(occurences[1]?.date).getDate().toString().padStart(2, '0')}/${(new Date(occurences[1]?.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(occurences[1]?.date).getFullYear().toString().padStart(2, '0')}`}</TabsTrigger>
          )}
          {occurences[2] && (
            <TabsTrigger value="activity3">{`${new Date(occurences[2]?.date).getDate().toString().padStart(2, '0')}/${(new Date(occurences[2]?.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(occurences[2]?.date).getFullYear().toString().padStart(2, '0')}`}</TabsTrigger>
          )}
        </TabsList>
      </div>
      <div className="flex justify-center my-4">
        <TabsContent value="activity1" className="w-6/12">
          <div className="flex text-3xl mb-4 justify-center">
            Places restantes : {activity.max_participants - validatedUser1.length}
          </div>
          <div className="grid grid-cols-3 justify-center">
            {pendingJoin1 && (
              <div className="flex justify-center text-lg">
                <div>Vous avez déjà fait une demande</div>
              </div>
            )}
            {joined1 && (
              <div className="flex justify-center text-lg">
                <div>Vous êtes inscrit</div>
              </div>
            )}
            {activity.max_participants - validatedUser1.length > 0 && occurences[0] && !pendingJoin1 && joined1 && (
              <JoinActivity id_activity={activity.id} date={occurences[0].date} />
            )}
          </div>
        </TabsContent>
        <TabsContent value="activity2">
          <div className="flex text-3xl mb-4 justify-center">
            Places restantes : {activity.max_participants - validatedUser2.length}
          </div>
        </TabsContent>
        <TabsContent value="activity3">
          <div className="flex text-3xl mb-4 justify-center">
            Places restantes : {activity.max_participants - validatedUser3.length}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default Occurences;
