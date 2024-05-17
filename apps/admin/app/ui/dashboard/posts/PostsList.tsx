import PostCard from '@/app/ui/dashboard/posts/PostCard';

type Post = {
  id: number;
  title: string;
  status: string;
  comments: number[];
  reports: number[];
};

function PostsList({ posts }: { posts: Post[] }) {
  return (
    <>
      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}

export default PostsList;
