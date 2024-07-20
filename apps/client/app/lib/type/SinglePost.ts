export type SinglePost = {
  id: number;
  title: string;
  created_at: string;
  cover_image: string;
  content: string;
  description: string;
  userLiked: boolean;
  author: {
    id: string;
    username: string;
  };
  categories: {
    id: number;
    name: string;
  }[];
  comments: {
    id: number;
    content: string;
    created_at: string;
    author: {
      id: number;
      username: string;
    };
  }[];
  views_number: number;
  comments_number: number;
  likes_number: number;
};
