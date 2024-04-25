export interface Post {
  id: number;
  title: string;
  createdAt: Date;
  cover_image: string;
  description: string;
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
