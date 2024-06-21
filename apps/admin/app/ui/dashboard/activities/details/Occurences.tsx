import type { Activity, Occurence } from '@/app/lib/type/Activities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';

function Occurences({ activity, occurences }: { activity: Activity; occurences: Occurence[] }) {
  return (
    <Tabs defaultValue="activity1">
      <div className="flex justify-center my-4">
        <TabsList>
          <TabsTrigger value="activity1">{`${new Date(occurences[0]?.date).getDate().toString().padStart(2, '0')}/${new Date(occurences[0]?.date).getMonth().toString().padStart(2, '0')}/${new Date(occurences[0]?.date).getFullYear().toString().padStart(2, '0')}`}</TabsTrigger>
          <TabsTrigger value="activity2">{`${new Date(occurences[1]?.date).getDate().toString().padStart(2, '0')}/${new Date(occurences[1]?.date).getMonth().toString().padStart(2, '0')}/${new Date(occurences[1]?.date).getFullYear().toString().padStart(2, '0')}`}</TabsTrigger>
          <TabsTrigger value="activity3">{`${new Date(occurences[2]?.date).getDate().toString().padStart(2, '0')}/${new Date(occurences[2]?.date).getMonth().toString().padStart(2, '0')}/${new Date(occurences[2]?.date).getFullYear().toString().padStart(2, '0')}`}</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="activity1">Make changes to your account here.</TabsContent>
      <TabsContent value="activity2">Change your password here.</TabsContent>
      <TabsContent value="activity3">Change your password here.</TabsContent>
    </Tabs>
  );
}

export default Occurences;
