'use client';

import PostsList from '@/app/ui/dashboard/posts/PostsList';
import PaginationComponent from '@repo/ui/components/ui/PaginationComponent';
import { Input } from '@repo/ui/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  status: string;
  comments: number[];
  reports: number[];
};

type PostData = {
  data: Post[];
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams({
        skip: `${page - 1}`,
        take: '10',
        search: searchTerm,
      });

      fetch(`${urlApi}/blog/posts?${queryParams}`, {
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
        .then((data: PostData) => {
          setPosts(data.data);
          setMaxPage(Math.ceil(data.count / 10));
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [page, searchTerm, router]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-semibold md:text-2xl">Articles</h1>
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[336px]"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm p-4" x-chunk="dashboard-02-chunk-1">
        <div className="grid grid-cols-2 gap-4 w-full">
          <PostsList posts={posts} />
        </div>
      </div>
      <PaginationComponent page={page} maxPage={maxPage} href="/dashboard/posts" />
    </>
  );
}

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <Suspense>
        <ShowContent />
      </Suspense>
    </main>
  );
}
