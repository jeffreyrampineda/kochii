import { Component, OnInit } from '@angular/core';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'kochii-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts = [];

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.recipesService.getPosts().subscribe({
      next: (result) => {
        this.posts = result;
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}
