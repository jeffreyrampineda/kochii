export interface Post {
  _id?: string;
  title: string;
  author: any;
  tags: string[];
  cooking_time: string;
  prep_time: string;
  calories: number;
  servings: number;
  ingredients: any;
  instructions: any;
  summary: string;
  banner: any;
  likes: number;
  dislikes: number;
  createdAt: Date;
  saved?: boolean;
}
