import type { SinglePost } from '@/app/lib/type/SinglePost';
import { getBlogPost } from '@/app/lib/utils/blog';
import BlogCommentSection from '@/app/ui/components/BlogCommentSection';
import LikeIcon from '@/app/ui/svg/LikeIcon';
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookOpenCheck, MessageSquare } from 'lucide-react';
import Link from 'next/link';

async function Page({ params }: { params: { id: string } }) {
  const data = await getBlogPost(Number(params.id));
  const post: SinglePost = data.data;
  const coverImageUrl = `${process.env.ATHLONIX_STORAGE_URL}/image/blog_posts/${post.cover_image}`;

  return (
    <main className="flex flex-col items-center gap-y-8 py-4">
      <div className="flex-col items-center justify-between w-[600px] leading-10">
        <div>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback className="bg-slate-400">{post.author.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p>
              <Link href="simon" className="font-medium text-accent underline underline-offset-2 max-w-32 truncate">
                {post.author.username}
              </Link>
              , <span>{format(new Date(post.created_at), 'EEE dd MMMM', { locale: fr })}</span>
            </p>
          </div>
        </div>
        <h1 className="mt-4">{post.title}</h1>
        <div className="w-[600px] h-[232px] mt-6 mb-6">
          <img
            className="h-full w-full object-cover"
            src={post.cover_image ? coverImageUrl : '/blog_post_default.jpg'}
            alt="selectionné"
          />
        </div>
        <p className="text-base leading-7 font-medium whitespace-pre-wrap">{post.content}</p>
        <div className=" mt-7 pb-8 w-full flex justify-start items-center gap-8 border-x-slate-800 border-b-2">
          <div className="flex items-center gap-1 font-medium text-sm">
            <span>{post.likes_number}</span>
            <button type="button" className="cursor-pointer">
              <LikeIcon isClicked={true} />
            </button>
          </div>

          <div className="flex items-center gap-1 font-medium text-sm">
            <span>{post.comments_number}</span>
            <div>
              <MessageSquare />
            </div>
          </div>

          <div className="flex items-center gap-1 font-medium text-sm">
            <span>{post.views_number}</span>
            <div>
              <BookOpenCheck />
            </div>
          </div>
        </div>
        <BlogCommentSection post={post} />
      </div>
    </main>
  );
}

export default Page;
