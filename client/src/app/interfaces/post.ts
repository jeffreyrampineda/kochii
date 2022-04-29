export interface Post {
  _id?: string;
  title: string;
  summary: string;
  banner: any;
  createdAt: Date;
  saved?: boolean;
  ingredients: any;
  instructions: string[];
  tags: string[];
  likes: number;
  dislikes: number;
  cooking_time: string;
  prep_time: string;
  calories: number;
  servings: number;
  author: any;
}
