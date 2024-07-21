export interface Post {
  id: number;
  title: string;
  createdAt: Date;
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
  views_number: number;
  comments_number: number;
  likes_number: number;
}
