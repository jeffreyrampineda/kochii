import { Post } from './post';

export interface PostCollection {
  _id?: string;
  posts: Post[];
}
