import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RecipesService } from 'src/app/services/recipes.service';
import { InventoryService } from 'src/app/services/inventory.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Post } from 'src/app/interfaces/post';

@Component({
  selector: 'kochii-post-cook',
  templateUrl: './post-cook.component.html',
  styleUrls: ['./post-cook.component.scss'],
})
export class PostCookComponent implements OnInit {
  ingredients = { missing: [], found: [] };
  post: Post;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private recipesService: RecipesService
  ) {}

  ngOnInit() {
    this.cook(this.route.snapshot.paramMap.get('id'));
  }

  cook(id: string): void {
    forkJoin({
      inventory: this.inventoryService.getItems(),
      post: this.recipesService.getPostById(id),
    }).subscribe({
      next: (result) => {
        // Check post.ingredients against inventory.
        this.ingredients = result.post.ingredients.reduce(
          (prev, curr) => {
            if (
              !result.inventory.find(
                (item) => item.name.toLowerCase() == curr.name.toLowerCase()
              )
            ) {
              prev.missing.push(curr.name);
            } else {
              prev.found.push(curr.name);
            }
            return prev;
          },
          { missing: [], found: [] }
        );
        this.post = result.post;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
