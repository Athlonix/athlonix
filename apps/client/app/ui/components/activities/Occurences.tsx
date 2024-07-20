import type { Activity, Occurence, User } from '@/app/lib/type/Activities';
import JoinActivity from '@/app/ui/components/activities/JoinActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { useEffect, useState } from 'react';

function Occurences({
  activity,
  occurences,
  users1,
  users2,
  users3,
}: {
  activity: Activity;
  occurences: Occurence[];
  users1: User[];
  users2: User[];
  users3: User[];
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

  const validatedUser1 = users1.filter((user) => user.active === true);
  const validatedUser2 = users2.filter((user) => user.active === true);
  const validatedUser3 = users3.filter((user) => user.active === true);

  const [pendingJoin1, setPendingJoin1] = useState<User>();
  const [pendingJoin2, setPendingJoin2] = useState<User>();
  const [pendingJoin3, setPendingJoin3] = useState<User>();

  const [joined1, setJoined1] = useState<User>();
  const [joined2, setJoined2] = useState<User>();
  const [joined3, setJoined3] = useState<User>();

  useEffect(() => {
    setPendingJoin1(users1.find((user) => user.id === userId && user.active === false));
    setPendingJoin2(users2.find((user) => user.id === userId && user.active === false));
    setPendingJoin3(users3.find((user) => user.id === userId && user.active === false));
    setJoined1(users1.find((user) => user.id === userId && user.active === true));
    setJoined2(users2.find((user) => user.id === userId && user.active === true));
    setJoined3(users3.find((user) => user.id === userId && user.active === true));
  }, [users1, users2, users3, userId]);

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
        <TabsContent value="activity2">
          <div className="flex text-3xl mb-4 justify-center">
            Places restantes : {activity.max_participants - validatedUser2.length}
          </div>
          <div className="flex justify-center">
            {pendingJoin2 && (
              <div className="flex justify-center text-lg">
                <div>Vous avez déjà fait une demande</div>
              </div>
            )}
            {joined2 && (
              <div className="flex justify-center text-lg">
                <div>Vous êtes inscrit</div>
              </div>
            )}
            {activity.max_participants - validatedUser2.length > 0 &&
              occurences[1] &&
              pendingJoin2 === undefined &&
              joined2 === undefined &&
              userId !== 0 && (
                <JoinActivity
                  id_activity={activity.id}
                  date={occurences[1].date}
                  user={userData}
                  setPendingJoin={setPendingJoin2}
                />
              )}
          </div>
        </TabsContent>
        <TabsContent value="activity3">
          <div className="flex text-3xl mb-4 justify-center">
            Places restantes : {activity.max_participants - validatedUser3.length}
          </div>
          <div className="flex justify-center">
            {pendingJoin3 && (
              <div className="flex justify-center text-lg">
                <div>Vous avez déjà fait une demande</div>
              </div>
            )}
            {joined3 && (
              <div className="flex justify-center text-lg">
                <div>Vous êtes inscrit</div>
              </div>
            )}
            {activity.max_participants - validatedUser3.length > 0 &&
              occurences[2] &&
              pendingJoin3 === undefined &&
              joined3 === undefined &&
              userId !== 0 && (
                <JoinActivity
                  id_activity={activity.id}
                  date={occurences[2].date}
                  user={userData}
                  setPendingJoin={setPendingJoin3}
                />
              )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default Occurences;
