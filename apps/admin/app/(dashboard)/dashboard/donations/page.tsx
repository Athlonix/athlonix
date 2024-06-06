'use client';
import { Card, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { type Donates, getAllDonations } from './functions';

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
    total: donations.length,
  }));

  return (
    <main>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Donations</CardTitle>
        </CardHeader>
        <div className="flex flex-col items-center">
          <h3 className="text-2xl">Montant total: {total}€</h3>
          <h3 className="text-2xl">Nombre de donations: {count}</h3>
        </div>
      </Card>
      <div className="flex justify-between">
        <Card>
          <CardHeader>
            <CardTitle>Donations par mois</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <BarChart
              width={600}
              height={300}
              data={monthlyTotals}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="dons" fill="#8884d8" />
            </BarChart>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Donations par montant</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <BarChart
              width={600}
              height={300}
              data={amountTotals}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="amount" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Donations;
