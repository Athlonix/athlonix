'use client';

import ReportsList from '@/app/ui/dashboard/posts/details/ReportsList';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/components/ui/pagination';
import { Separator } from '@repo/ui/components/ui/separator';
import { MoreHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  comments: number[];
  reports: number[];
};

type Report = {
  id: number;
  created_at: string;
  id_reason: number;
  content: string;
};

type Reason = {
  id: number;
  reason: string;
};

type ReportsData = {
  data: Report[];
  count: number;
};

function ShowReports() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idPost = searchParams.get('id_post');
  let page = searchParams.get('page') || 1;
  if (typeof page === 'string') {
    page = Number.parseInt(page);
  }

  const [openDelete, setOpenDelete] = useState(false);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [post, setPost] = useState<Post>();
  const [reports, setReports] = useState<Report[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/blog/posts/${idPost}`, {
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
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
        console.log(error);
      });

    const queryParams = new URLSearchParams({
      skip: `${page - 1}`,
      take: '10',
    });

    fetch(`${urlApi}/reports/posts/${idPost}?${queryParams}`, {
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
      .then((data: ReportsData) => {
        setReports(data.data);
        setMaxPage(Math.ceil(data.count / 10));
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${urlApi}/reasons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data) => {
        setReasons(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [idPost, router, page]);

  function deletePost() {
    if (idPost === null) {
      return;
    }
    const id = Number(idPost);

    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/blog/posts/${id}/soft`, {
      method: 'PATCH',
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
      .then((response) => {
        console.log(response);
        router.push('/dashboard/posts');
      });

    setOpenDelete(false);
  }

  return (
    <>
      <div className="flex items-center gap-5 justify-center">
        <h1 className="text-lg font-semibold md:text-2xl">{post?.title}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Button variant="ghost" className="w-full p-0 font-normal pl-2">
              <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogTrigger className="w-full text-left">Supprimer</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Suppression du post</DialogTitle>
                    <DialogDescription>
                      <div className="mb-4">Êtes-vous sûr de vouloir supprimer ce post?</div>
                      <div className="flex w-full justify-end gap-4">
                        <Button variant="destructive" onClick={deletePost}>
                          Supprimer
                        </Button>
                        <Button variant="secondary" onClick={() => setOpenDelete(false)}>
                          Annuler
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <div className="mx-5 border border-black rounded-lg">
        <ReportsList reports={reports} reasons={reasons} />
      </div>
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                className="border border-gray-500 rounded-lg"
                href={`/dashboard/posts/details?page=${page - 1}&id_post=${idPost}`}
              />
            </PaginationItem>
          )}
          {page > 3 && (
            <PaginationItem>
              <PaginationLink
                className="border border-gray-500 rounded-lg"
                href={`/dashboard/posts/details?page=${page - 2}&id_post=${idPost}`}
              >
                {page - 2}
              </PaginationLink>
            </PaginationItem>
          )}
          {page > 2 && (
            <PaginationItem>
              <PaginationLink
                className="border border-gray-500 rounded-lg"
                href={`/dashboard/posts/details?page=${page - 1}&id_post=${idPost}`}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              className="border border-gray-500 rounded-lg"
              href={`/dashboard/posts/details?page=${page}&id_post=${idPost}`}
              isActive
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          {page < maxPage && (
            <PaginationItem>
              <PaginationLink
                className="border border-gray-500 rounded-lg"
                href={`/dashboard/posts/details?page=${page + 1}&id_post=${idPost}`}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {page < maxPage - 1 && (
            <PaginationItem>
              <PaginationLink
                className="border border-gray-500 rounded-lg"
                href={`/dashboard/posts/details?page=${page + 2}&id_post=${idPost}`}
              >
                {page + 2}
              </PaginationLink>
            </PaginationItem>
          )}
          {page < maxPage && (
            <PaginationItem>
              <PaginationNext
                className="border border-gray-500 rounded-lg"
                href={`/dashboard/posts/details?page=${page + 1}&id_post=${idPost}`}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}

function page() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <Suspense>
        <ShowReports />
      </Suspense>
    </main>
  );
}

export default page;
