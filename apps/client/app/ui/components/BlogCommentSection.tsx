'use client';

import type { SinglePost } from '@/app/lib/type/SinglePost';
import { type User, getUserFromCookie } from '@/app/lib/utils';
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar';
import { Button } from '@ui/components/ui/button';
import { toast } from '@ui/components/ui/sonner';
import { useEffect, useState } from 'react';
import BlogComment from './BlogComment';

function BlogCommentSection({ post: firstPost }: { post: SinglePost }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkUser() {
      const user = await getUserFromCookie();
      if (user) {
        setUser(user);
      }
    }
    checkUser();
  }, []);

  const [newComment, setNewComment] = useState('');
  const [newCommentError, setNewCommentError] = useState<string | undefined>(undefined);
  const [post, setPost] = useState<SinglePost>(firstPost);

  const commentsSorted = post.comments.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const postComments = commentsSorted.map((comment) => {
    return (
      <BlogComment
        key={comment.id}
        likeNumber={4}
        author={comment.author.username}
        content={comment.content}
        created_at={comment.created_at}
      />
    );
  });

  function sendComment() {
    if (newComment.length < 1) {
      setNewCommentError('Vous ne pouvez pas envoyer de commentaire vide');
      return;
    }
    setNewCommentError(undefined);

    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${urlApi}/blog/posts/${post.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then(async (response) => {
        if (response.status !== 201) {
          const error = await response.json();
          throw new Error(error.message);
        }
        toast.success('Succès', { description: 'Commentaire ajouté avec succès' });
        refreshBlogPost();
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 20000, description: error?.message });
      });
  }

  async function refreshBlogPost() {
    const queryPath = `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${post.id}`;
    await fetch(queryPath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const data = await response.json();
        setPost(data);
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 20000, description: error?.message });
      });
  }

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setNewComment(value);
  }

  return (
    <section className="mt-8">
      {user && (
        <div className="flex items-center w-full gap-4 justify-start">
          <Avatar className="self-start">
            <AvatarFallback className="bg-slate-400">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <textarea
            value={newComment}
            className="w-full leading-6  border-accent border-2 rounded-3xl px-4 py-4 placeholder:text-accent placeholder:opacity-70"
            placeholder="Ecrire un commentaire..."
            name="comment"
            onChange={handleCommentChange}
          />
        </div>
      )}
      {newCommentError && (
        <div className="flex justify-end text-red-500">
          <p>{newCommentError}</p>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <Button onClick={sendComment}>Envoyer</Button>
      </div>
      <div className="flex flex-col gap-7">{postComments}</div>
    </section>
  );
}

export default BlogCommentSection;
