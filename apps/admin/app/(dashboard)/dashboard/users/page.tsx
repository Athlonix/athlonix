import { ListFilter, PlusCircle } from 'lucide-react';

import { UsersList } from '@/app/ui/dashboard/users/UsersList';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Input } from '@repo/ui/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Tabs, TabsContent } from '@repo/ui/components/ui/tabs';

export default function Page(): JSX.Element {
  return (
    <main>
      <div className="flex flex-col h-full">
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <Tabs defaultValue="all">
                <TabsContent value="all">
                  <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Utilisateurs</CardTitle>
                      <div className="flex gap-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                              <ListFilter className="h-3.5 w-3.5" />
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Rôles</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem>Retirer</DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem>Banni</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked>Utilisateur</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Rédacteur</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Modérateur</DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" className="h-8 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un utilisateur</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-auto flex items-center gap-2">
                        <Input
                          type="search"
                          placeholder="Search..."
                          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom d'utilisateur</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Référant</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Date d'éxpiration</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <UsersList />
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong> products
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}
