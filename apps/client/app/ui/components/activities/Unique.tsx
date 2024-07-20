import type { Activity, Occurence, User } from '@/app/lib/type/Activities';
import JoinActivity from '@/app/ui/components/activities/JoinActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { useEffect, useState } from 'react';

function Occurences({
  activity,
  occurences,
  users,
}: {
  activity: Activity;
  occurences: Occurence[];
  users: User[];
}) {
  const user = localStorage.getItem('user');
  let userId = 0;
  let userData: User = {} as User;
  if (user) {
    userId = JSON.parse(user).id;
    userData = {
      id: JSON.parse(user).id,
      username: JSON.parse(user).username,
      active: false,
    };
  }

  console.log(users);

  const validatedUser1 = users.filter((user) => user.active === true);

  const [pendingJoin1, setPendingJoin1] = useState<User>();

  const [joined1, setJoined1] = useState<User>();

  useEffect(() => {
    setPendingJoin1(users.find((user) => user.id === userId && user.active === false));
    setJoined1(users.find((user) => user.id === userId && user.active === true));
  }, [users, userId]);

  return (
    <Tabs defaultValue="activity">
      <div className="flex justify-center my-4">
        <TabsList>
          {occurences[0] && (
            <TabsTrigger value="activity">{`${new Date(occurences[0]?.date).getDate().toString().padStart(2, '0')}/${(new Date(occurences[0]?.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(occurences[0]?.date).getFullYear().toString().padStart(2, '0')}`}</TabsTrigger>
          )}
        </TabsList>
      </div>
      <div className="flex justify-center my-4">
        <TabsContent value="activity" className="w-6/12">
          {occurences[0] &&
          new Date(`${occurences[0]?.date.split('T')[0]}T${activity.start_time}`).getTime() < new Date().getTime() ? (
            <div className="flex text-xl mb-4 justify-center">
              <div>L'activité de cette journée a déjà commencé</div>
            </div>
          ) : (
            <>
              <div className="flex text-3xl mb-4 justify-center">
                Places restantes : {activity.max_participants - validatedUser1.length}
              </div>
              <div className="flex justify-center">
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
                {activity.max_participants - validatedUser1.length > 0 &&
                  occurences[0] &&
                  pendingJoin1 === undefined &&
                  joined1 === undefined &&
                  userId !== 0 && (
                    <JoinActivity
                      id_activity={activity.id}
                      date={occurences[0].date}
                      user={userData}
                      setPendingJoin={setPendingJoin1}
                    />
                  )}
              </div>
            </>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default Occurences;
