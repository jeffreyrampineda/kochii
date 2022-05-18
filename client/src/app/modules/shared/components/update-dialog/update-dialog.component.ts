import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryService } from 'src/app/services/inventory.service';
import { forkJoin, Observable } from 'rxjs';
import { Item } from 'src/app/interfaces/item';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-update-dialog',
  templateUrl: 'update-dialog.component.html',
})
export class UpdateDialogComponent {
  loading = false;
  error_messages = [];

  constructor(
    private inventoryService: InventoryService,
    public dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // -------------------------------------------------------------

  /** Close this dialog without sending data. */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Update the item with the same _id.
   * Option declares whether to set or inc.
   * @param item - The item to be updated.
   */
  updateItem(item: Item): Observable<any> {
    if (this.data.option === 'inc') {
      console.log('Deducting quantity');
      item.quantity = -item.quantity;
    }

    return this.inventoryService.updateItem(item, this.data.option);
  }

  /**
   * Update the item with the same name and expirationDate,
   * If no item is found, create new item.
   * @param item - The item to be upserted.
   */
  createItem(newItem: Item): Observable<any> {
    return this.inventoryService.createItem(newItem);
  }

  /** Loops through data.items and update each item individually. */
  onSubmit() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    const observablesGroup = [];

    if (this.data.isAdding) {
      this.data.items.forEach((item) => {
        observablesGroup.push(this.createItem(item));
      });
    } else {
      this.data.items.forEach((item) => {
        observablesGroup.push(this.updateItem(item));
      });
    }

    forkJoin(observablesGroup).subscribe({
      next: (response) => {
        const successful = response.reduce((acc: number, curr) => {
          // Only increment if it's not undefined.
          if (curr) {
            acc += 1;
          }
          return acc;
        }, 0);
        const total = observablesGroup.length;
        this.dialogRef.close({ successful, total });
      },
      error: (err) => {
        this.error_messages = err.error.error_messages;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
