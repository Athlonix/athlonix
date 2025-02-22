'use client';
import { type Stats, getStats } from '@/app/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@repo/ui/components/ui/chart';
import Loading from '@repo/ui/components/ui/loading';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

const NoDataMessage = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-gray-500">Aucune donnée disponible</p>
  </div>
);

const chartConfig = {
  donations: {
    label: 'Donations',
    color: '#2563eb',
  },
  members: {
    label: 'Membres',
    color: '#10b981',
  },
} satisfies ChartConfig;

function StatisticPage(): JSX.Element {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStats();
        setStats(result);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Statistiques d'Athlonix 📊 </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres Totaux 👥 </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMembers ?? 'N/A'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sports ⚽ </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSports ?? 'N/A'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités 🎯 </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalActivities ?? 'N/A'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tournois 🏆 </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTournaments ?? 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Membres 📈 </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.membersByMonth && stats?.membersByMonth.length > 0 ? (
              <ChartContainer className="w-full h-300" config={chartConfig}>
                <BarChart data={stats?.membersByMonth} accessibilityLayer={true}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickMargin={10} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="members" name={'Membres'} fill="var(--color-members)" radius={4} width={2} />
                </BarChart>
              </ChartContainer>
            ) : (
              <NoDataMessage />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donations 🤝 </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.donations && stats.donations.length > 0 ? (
              <ChartContainer className="w-full h-300" config={chartConfig}>
                <BarChart data={stats.donations} accessibilityLayer={true}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="amount" name={'Montant (€)'} fill="var(--color-donations)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <NoDataMessage />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default StatisticPage;
