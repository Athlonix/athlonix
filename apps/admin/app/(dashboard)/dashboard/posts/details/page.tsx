'use client';

import ReportsList from '@/app/ui/dashboard/posts/details/ReportsList';
import { Separator } from '@repo/ui/components/ui/separator';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

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

function page() {
  const searchParams = useSearchParams();
  const idPost = searchParams.get('id_post');
  const router = useRouter();

  const [post, setPost] = React.useState<Post>();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [reasons, setReasons] = React.useState<Reason[]>([]);

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

    fetch(`${urlApi}/blog/posts/${idPost}/reports`, {
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
  }, [idPost, router]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex items-center gap-5 justify-center">
        <h1 className="text-lg font-semibold md:text-2xl">{post?.title}</h1>
      </div>
      <Separator />
      <ReportsList reports={reports} reasons={reasons} />
    </main>
  );
}

export default page;
