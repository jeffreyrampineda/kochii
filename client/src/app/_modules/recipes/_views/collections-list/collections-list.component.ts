import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/post';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-collections-list',
  templateUrl: './collections-list.component.html',
})
export class CollectionsListComponent implements OnInit {
  posts: Post[] = [];

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.getPostCollection();
  }

  getPostCollection(): void {
    this.recipesService.getPostCollection().subscribe({
      next: (result) => {
        this.posts = result.posts;
      },
      error: () => {},
      complete: () => {},
    });
  }
}
