import { Card, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';
import { CircleAlert, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Post = {
  id: number;
  title: string;
  comments: number[];
  reports: number[];
};

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/dashboard/posts/details?id_post=${post.id}`}>
      <Card className="h-[150px]">
        <CardHeader>
          <CardTitle className="flex justify-center">{post.title}</CardTitle>
        </CardHeader>
        <Separator className="mt-2" />
        <CardFooter className="flex justify-between px-0">
          <Separator orientation="vertical" className="h-10" />
          <div className="flex flex-row items-center gap-4">
            <CircleAlert size={24} />
            <p>{post.reports.length}</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="flex flex-row items-center gap-4">
            <MessageCircle size={24} />
            <p>{post.comments.length}</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
        </CardFooter>
      </Card>
    </Link>
  );
}

export default PostCard;
