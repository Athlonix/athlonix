'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@ui/components/ui/chart';
import { Euro } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import { type Donates, getAllDonations } from './functions';

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

const Donations = () => {
  const [donations, setDonations] = useState<Donates[]>([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      const { data, count } = await getAllDonations();
      setDonations(data);
      setCount(count);
      setTotal(data.reduce((acc, donation) => acc + donation.amount, 0));
    };
    fetchDonations();
  }, []);

  const donationsByMonth = donations.reduce(
    (acc, donation) => {
      const month = new Date(donation.created_at).toLocaleString('default', {
        month: 'long',
      });
      if (month) {
        acc[month] = acc[month] || [];
        acc[month]?.push(donation);
      }
      return acc;
    },
    {} as { [month: string]: Donates[] },
  );

  const monthlyTotals = Object.entries(donationsByMonth).map(([month, donations]) => ({
    month,
    dons: donations.length,
    total: donations.reduce((acc, donation) => acc + donation.amount, 0),
  }));

  const donationsByAmount = donations.reduce(
    (acc, donation) => {
      acc[donation.amount] = acc[donation.amount] || [];
      acc[donation.amount]?.push(donation);
      return acc;
    },
    {} as { [amount: number]: Donates[] },
  );

  const amountTotals = Object.entries(donationsByAmount).map(([amount, donations]) => ({
    amount: Number(amount),
    total: donations.length ?? 0,
  }));

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Donations 🎁</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Euro size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant Total</p>
                <p className="text-2xl font-bold">{total ?? 'N/A'}€</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Nombre de Donations</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre de Donations</p>
                <p className="text-2xl font-bold">{count ?? 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Donations par Mois</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer className="w-full h-300" config={chartConfig}>
              <BarChart data={monthlyTotals} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="dons" fill="#3b82f6" name="Donations" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Donations par Montant</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer className="w-full h-300" config={chartConfig}>
              <BarChart data={amountTotals} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="amount" tickMargin={10} name="Montant (€)" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="total" fill="#8b5cf6" name="Montant" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donations;
