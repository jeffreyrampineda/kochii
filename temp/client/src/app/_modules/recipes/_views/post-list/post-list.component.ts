import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/post';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.recipesService.getPosts().subscribe({
      next: (result) => {
        this.posts = result;
      },
      error: () => {},
      complete: () => {},
    });
  }
}
