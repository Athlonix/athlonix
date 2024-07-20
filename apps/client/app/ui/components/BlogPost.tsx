'use client';

import type { Post } from '@/app/lib/type/Post';
import LikeIcon from '@/app/ui/svg/LikeIcon';
import { Badge } from '@repo/ui/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookOpenCheck, Ellipsis, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  const coverImageUrl = `${process.env.ATHLONIX_STORAGE_URL}/image/blog_posts/${cover_image}`;
  const placeholder = '/blog_post_default.jpg';

  const [imageError, setImageError] = useState(false);

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
              className="object-cover"
              width={256}
              height={144}
              src={imageError ? placeholder : coverImageUrl}
              style={{ width: '256px', height: '144px' }} // optional
              alt="illu"
              onError={() => setImageError(true)}
            />
          </Link>
        </div>
        <div className="h-full max-w-[624px]">
          <Link href={`/blog/posts/${id}`}>
            <h2 className="truncate cursor-pointer hover:text-slate-400" title={title}>
              {title}
            </h2>
          </Link>
          <div className="flex items-center gap-6">
            <p>
              Par{' '}
              <Link href="simon" className="font-medium text-accent underline underline-offset-2 max-w-32 truncate">
                {author.username}
              </Link>
              , <span>{format(createdAt, 'EEE dd MMMM', { locale: fr })}</span>
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
