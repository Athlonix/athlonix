'use client';

import AddAddress from '@/app/ui/dashboard/addresses/AddAddress';
import AddressesList from '@/app/ui/dashboard/addresses/AddressesList';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/components/ui/pagination';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Tabs, TabsContent } from '@repo/ui/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type Address = {
  id: number;
  road: string;
  postal_code: string;
  complement: string | null;
  city: string;
  number: number;
  name: string | null;
  id_lease: number | null;
};

type AddressData = {
  data: Address[];
  count: number;
};

function ShowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let page = searchParams.get('page') || 1;
  if (typeof page === 'string') {
    page = Number.parseInt(page);
  }

  const [maxPage, setMaxPage] = useState<number>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams({
        skip: `${page - 1}`,
        take: '10',
        search: searchTerm,
      });

      fetch(`${urlApi}/addresses?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => {
          if (response.status === 403) {
            router.push('/');
          }
          return response.json();
        })
        .then((data: AddressData) => {
          setAddresses(data.data);
          setMaxPage(Math.ceil(data.count / 10));
        })
        .catch((error: Error) => {
          console.log(error);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [page, searchTerm, router]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TabsContent value="all">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Adresses</CardTitle>
          <AddAddress addresses={addresses} setAddresses={setAddresses} />
        </CardHeader>
        <CardContent>
          <div className="ml-auto flex items-center gap-2">
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alias</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Code postal</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AddressesList addresses={addresses} />
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`/dashboard/addresses?page=${page - 1}`} />
                </PaginationItem>
              )}
              {page > 3 && (
                <PaginationItem>
                  <PaginationLink href={`/dashboard/addresses?page=${page - 2}`}>{page - 2}</PaginationLink>
                </PaginationItem>
              )}
              {page > 2 && (
                <PaginationItem>
                  <PaginationLink href={`/dashboard/addresses?page=${page - 1}`}>{page - 1}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href={`/dashboard/addresses?page=${page}`} isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>
              {page < maxPage && (
                <PaginationItem>
                  <PaginationLink href={`/dashboard/addresses?page=${page + 1}`}>{page + 1}</PaginationLink>
                </PaginationItem>
              )}
              {page < maxPage - 1 && (
                <PaginationItem>
                  <PaginationLink href={`/dashboard/addresses?page=${page + 2}`}>{page + 2}</PaginationLink>
                </PaginationItem>
              )}
              {page < maxPage && (
                <PaginationItem>
                  <PaginationNext href={`/dashboard/addresses?page=${page + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

export default function Page(): JSX.Element {
  return (
    <main>
      <div className="flex flex-col h-full">
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <Tabs defaultValue="all">
                <Suspense>
                  <ShowContent />
                </Suspense>
              </Tabs>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}
