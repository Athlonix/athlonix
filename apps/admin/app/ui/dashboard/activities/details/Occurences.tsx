import type { Activity, Occurence, User } from '@/app/lib/type/Activities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';

function Occurences({
  activity,
  occurences,
  users1,
  users2,
  users3,
}: { activity: Activity; occurences: Occurence[]; users1: User[]; users2: User[]; users3: User[] }) {
  const validatedUser1 = users1.filter((user) => user.active === true);
  const validatedUser2 = users2.filter((user) => user.active === true);
  const validatedUser3 = users3.filter((user) => user.active === true);

  const pendingUser1 = users1.filter((user) => user.active === false);
  const pendingUser2 = users2.filter((user) => user.active === false);
  const pendingUser3 = users3.filter((user) => user.active === false);
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
            Participants : ({validatedUser1.length}/{activity.max_participants})
          </div>
          <div className="grid grid-cols-3 justify-center">
            {validatedUser1.map((user) => (
              <div key={user.id} className="flex justify-center">
                <div>{user.username}</div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activity2">
          <div className="flex text-3xl mb-4 justify-center">
            Participants : ({validatedUser2.length}/{activity.max_participants})
          </div>
          <div className="grid grid-cols-3 justify-center">
            {validatedUser2.map((user) => (
              <div key={user.id} className="flex justify-center">
                <div>{user.username}</div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activity3">
          <div className="flex text-3xl mb-4 justify-center">
            Participants : ({validatedUser3.length}/{activity.max_participants})
          </div>
          <div className="grid grid-cols-3 justify-center">
            {validatedUser3.map((user) => (
              <div key={user.id} className="flex justify-center">
                <div>{user.username}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default Occurences;
