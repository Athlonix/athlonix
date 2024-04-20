'use client';

import LikeIcon from '@/app/ui/svg/LikeIcon';
import { Badge } from '@repo/ui/components/ui/badge';
import { BookOpenCheck, Ellipsis, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface PostProps {
  id: number;
  content: string;
  coverImage: string;
  title: string;
  userName: string;
  like: number;
  userLiked: boolean;
  views: number;
  comments: number;
  createdDate: Date;
  badges: string[];
  handleLikeButton: (id: number) => void;
}

export const BlogPost: React.FC<PostProps> = ({
  id,
  content,
  coverImage,
  title,
  userName,
  like,
  views,
  comments,
  userLiked,
  createdDate,
  badges,
  handleLikeButton,
}: PostProps) => {
  const coverImageName: string = coverImage.split('.')[0] || '';

  const badgesElements = badges.map((badge) => (
    <Badge key={badge} className="w-16 flex items-center justify-center">
      {badge}
    </Badge>
  ));

  return (
    <div className="h-44 p-4 shadow-lg">
      <div className="flex gap-6">
        <div className="relative w-64 h-36">
          <Image
            className="absolute object-cover top-0 left-0"
            src={`https://wkpdfodfnkbdvyjuuttd.supabase.co/storage/v1/object/public/images/blog_posts/${coverImage}`}
            layout="fill"
            alt={coverImageName}
          />
        </div>
        <div className="h-full max-w-[624px]">
          <h2 className="truncate cursor-pointer hover:text-slate-400">{title}</h2>
          <div className="flex items-center gap-6">
            <p>
              Par{' '}
              <Link href="simon" className="font-medium text-accent underline underline-offset-2 max-w-32 truncate">
                {userName}
              </Link>
              , <span>{createdDate.toDateString()}</span>
            </p>
            <div className="flex items-center gap-3">{badgesElements}</div>
          </div>
          <p className="font-extralight text-slate-950 leading-5 text-ellipsis overflow-hidden">{content}</p>
        </div>
        <div className=" flex flex-col justify-between ml-auto">
          <div className="flex justify-end w-full">
            <Link href="/">
              <Ellipsis />
            </Link>
          </div>
          <div className="w-full flex justify-end items-center gap-4">
            <div className="flex items-center gap-1 font-medium text-sm">
              <span>{like}</span>
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => {
                  console.log('testttt');
                  handleLikeButton(id);
                }}
              >
                <LikeIcon isClicked={userLiked} />
              </button>
            </div>

            <div className="flex items-center gap-1 font-medium text-sm">
              <span>{comments}</span>
              <div>
                <MessageSquare />
              </div>
            </div>

            <div className="flex items-center gap-1 font-medium text-sm">
              <span>{views}</span>
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
