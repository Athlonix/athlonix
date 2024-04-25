'use client';

import type { Post } from '@/app/lib/type/Post';
import LikeIcon from '@/app/ui/svg/LikeIcon';
import { Badge } from '@repo/ui/components/ui/badge';
import { BookOpenCheck, Ellipsis, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type PostProps = Post & {
  handleLikeButton: (id: number) => void;
};

export const BlogPost: React.FC<PostProps> = ({
  id,
  description,
  cover_image,
  createdAt,
  title,
  author,
  likes_number,
  views_number,
  comments_number,
  categories,
  handleLikeButton,
}: PostProps) => {
  const coverImageName: string = cover_image.split('.')[0] || '';

  const badgesElements = categories.map((badge) => (
    <Badge key={badge.id} className="min-w-16 flex items-center justify-center">
      {badge.name}
    </Badge>
  ));

  return (
    <div className="h-44 p-4 shadow-lg">
      <div className="flex gap-6 h-full">
        <div className="relative w-64 h-36">
          <Link href="/simon">
            <Image
              className="absolute object-cover top-0 left-0"
              src={`${process.env.ATHLONIX_STORAGE_URL}/image/blog_posts/${cover_image}`}
              layout="fill"
              alt={coverImageName}
            />
          </Link>
        </div>
        <div className="h-full max-w-[624px]">
          <h2 className="truncate cursor-pointer hover:text-slate-400" title={title}>
            {title}
          </h2>
          <div className="flex items-center gap-6">
            <p>
              Par{' '}
              <Link href="simon" className="font-medium text-accent underline underline-offset-2 max-w-32 truncate">
                {author.username}
              </Link>
              {/* , <span>{createdAt.toString()}</span> */}
            </p>
            <div className="flex items-center gap-3">{badgesElements}</div>
          </div>
          <div>
            <p className="font-extralight text-slate-950 leading-5 h-full line-clamp-3 text-ellipsis">{description}</p>
          </div>
        </div>
        <div className=" flex flex-col justify-between ml-auto">
          <div className="flex justify-end w-full">
            <Link href="/">
              <Ellipsis />
            </Link>
          </div>
          <div className="w-full flex justify-end items-center gap-4">
            <div className="flex items-center gap-1 font-medium text-sm">
              <span>{likes_number}</span>
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => {
                  console.log('testttt');
                  handleLikeButton(id);
                }}
              >
                <LikeIcon isClicked={true} />
              </button>
            </div>

            <div className="flex items-center gap-1 font-medium text-sm">
              <span>{comments_number}</span>
              <div>
                <MessageSquare />
              </div>
            </div>

            <div className="flex items-center gap-1 font-medium text-sm">
              <span>{views_number}</span>
              <div>
                <BookOpenCheck />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
