import { Avatar, AvatarFallback } from '@ui/components/ui/avatar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import React from 'react';
import LikeIcon from '../svg/LikeIcon';

interface BlogCommentProps {
  author: string;
  content: string;
  likeNumber: number;
  created_at: string;
}
function BlogComment({ author, content, likeNumber, created_at }: BlogCommentProps) {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback className="bg-slate-400">{author.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <p>
            <Link href="simon" className="font-medium text-accent underline underline-offset-2 max-w-32 truncate">
              {author}
            </Link>
            , <span>{format(new Date(created_at), 'EEE dd MMMM', { locale: fr })}</span>
          </p>
        </div>
        <p>{content}</p>
        <div className="flex items-center gap-1 font-medium text-sm">
          <span>{likeNumber}</span>
          <button type="button" className="cursor-pointer">
            <LikeIcon isClicked={true} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogComment;
