import { Component, OnInit } from '@angular/core';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'kochii-collections-list',
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.scss'],
})
export class CollectionsListComponent implements OnInit {
  posts = [];

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.getPostCollection();
  }

  getPostCollection(): void {
    this.recipesService.getPostCollection().subscribe({
      next: (result) => {
        this.posts = result.posts;
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}
