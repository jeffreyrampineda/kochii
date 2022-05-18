import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RecipesService } from 'src/app/services/recipes.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { Post } from 'src/app/interfaces/post';
import { UpdateDialogComponent } from '../../../shared/components/update-dialog/update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'kochii-post-cook',
  templateUrl: './post-cook.component.html',
})
export class PostCookComponent implements OnInit {
  ingredients = { recipe: [], inventory: [] };
  post: Post;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private recipesService: RecipesService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.startCooking(this.route.snapshot.paramMap.get('id'));
  }

  startCooking(id: string): void {
    forkJoin({
      inventory: this.inventoryService.getItems(),
      post: this.recipesService.getPostById(id),
    }).subscribe({
      next: (result) => {
        // Check post.ingredients against inventory.
        this.ingredients = result.post.ingredients.reduce(
          (prev, curr) => {
            const found_item = result.inventory.find(
              (item) => item.name.toLowerCase() == curr.name.toLowerCase()
            );
            if (!found_item) {
              curr.found = false;
            } else {
              const item = Object.assign({ removing: true }, found_item);
              // Set to remove curr.quantity if there is more item.quantity in inventory,
              // else remove all item.quantity
              item.quantity =
                item.quantity > curr.quantity ? curr.quantity : item.quantity;
              prev.inventory.push(item);
              curr.found = true;
            }
            prev.recipe.push(curr);
            return prev;
          },
          { recipe: [], inventory: [] }
        );
        this.post = result.post;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  completeCooking(): void {
    const items = this.ingredients.inventory.filter((item) => item.removing);

    if (items.length == 0) {
      this.messageService.notify('Cooking completed.');
      this.router.navigate(['recipes/catalog', this.post._id]);
      return;
    }

    /** Opens the update dialog. */
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmation: Removing',
        description: 'Removing the following items',
        items: items,
        isAdding: false,
        option: 'inc',
      },
    });

    // Confirmed.
    dialogRef.afterClosed().subscribe({
      next: (response) => {
        if (response && response.successful) {
          this.messageService.notify(
            `${response.successful}/${response.total} items were successfully updated.`
          );
          this.router.navigate(['recipes/catalog', this.post._id]);
        }
      },
      error: (err) => {
        this.messageService.notify(err.error);
      },
      complete: () => {},
    });
  }

  isMissing(): boolean {
    return this.ingredients.recipe.some((ingredient) => !ingredient.found);
  }
}
