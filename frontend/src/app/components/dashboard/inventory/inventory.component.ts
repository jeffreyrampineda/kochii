import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { Item } from '../../../interfaces/item';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['name', 'quantity', 'expirationDate'];
    inventory: MatTableDataSource<Item>;
    showSelect: Boolean = false;
    selection: SelectionModel<Item> = new SelectionModel<Item>(true, []);

    // Used for updating/removing items.
    temporarySelectedItems: Item[] = [];

    constructor(
        private inventoryService: InventoryService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.getInventory();
    }

    getInventory(): void {
        this.inventoryService.getInventory().subscribe(
            inventory => {
                this.inventory = new MatTableDataSource(inventory);
                this.inventory.paginator = this.paginator;
                this.inventory.sort = this.sort;
                this.inventory.sortingDataAccessor = (item, property) => {
                    switch (property) {
                      case 'expirationDate': return new Date(item.expirationDate);
                      default: return item[property];
                    }
                };
            }
        );
    }

    // delete single
    deleteItem(_id: string): void {
        this.inventoryService.deleteItem(_id).subscribe(
            results => {
                if(results.ok === 1) {
                    this.inventory.data = this.inventory.data.filter(i => i._id !== _id);
                }
            }
        );
    }

    // TODO -- replace with upsert
    // update item quantity single
    updateItemRemoveQuantity(quantityToRemove: Item): void {

        // Get the currentQuantity for reference.
        const currentQuantity = this.inventory.data.find(a => a._id === quantityToRemove._id);

        // Delete item if quantityToRemove is same as currentQuantity
        if(quantityToRemove.quantity === currentQuantity.quantity) {
            this.deleteItem(currentQuantity._id);
        }
        
        // Only allow ranges between 1 to currentQuantity
        else if(quantityToRemove.quantity > 0 && quantityToRemove.quantity < currentQuantity.quantity) {

            // Update currentQuantity before updating to backend.
            currentQuantity.quantity -= quantityToRemove.quantity;

            // Update to backend.
            this.inventoryService.updateItem(currentQuantity).subscribe(
                results => {
                    console.log(results);
                }
            );
        } else {
            console.log("updateItem - error");
        }
    }

    updateManyItemRemoveQuantity(itemsNewValues: Item[]): void {
        itemsNewValues.forEach(newValues => {
            this.updateItemRemoveQuantity(newValues);
        });
    }

    expirationCountdown(date: string): number {
        const expirationDate = new Date(date);
        const today = new Date();
        const timeDiff = expirationDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }

    applyFilter(filterValue: string) {
        this.inventory.filter = filterValue.trim().toLowerCase();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.inventory.data.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    selectMasterToggle() {
      this.isAllSelected() ? this.selectionClear() : this.inventory.data.forEach(item => this.selectionSelect(item));
    }

    // Called by "Remove" button and "Cancel"
    selectColumnToggle() {
        this.showSelect = !this.showSelect;
        if(this.showSelect) {
            this.displayedColumns.unshift("select");
        } else {
            this.temporarySelectedItems = [];
            this.selection.clear(); 
            this.displayedColumns.shift();
        }
    }

    // Called by "Remove" button
    openDeleteConfirmationDialog(): void {
        const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
            width: '250px',
            data: this.temporarySelectedItems
        });

        // Confirmed.
        dialogRef.afterClosed().subscribe(
            result => {
                if(result.length > 0) {
                    this.updateManyItemRemoveQuantity(result);
                }
                this.selectColumnToggle();
            }
        );
    }

    selectionSelect(item: Item): void {
        this.selection.select(item);
        this.temporarySelectedItems.push(JSON.parse(JSON.stringify(item)));
    }

    selectionClear(): void {
        this.selection.clear();
        this.temporarySelectedItems = [];
    }

    // Called when clicking selection checkbox
    selectionToggle(item: Item): void {
        this.selection.toggle(item);
        if(this.selection.isSelected(item)) {

            // Stringify then parse to clone the values instead of reference.
            this.temporarySelectedItems.push(JSON.parse(JSON.stringify(item)));
        } else {
            const idx = this.temporarySelectedItems.findIndex(a => a._id === item._id);
            if(idx > -1) {
                this.temporarySelectedItems.splice(idx, 1);
            }
        }
    }
    
    // Called by each selected row. Used to two-way bind quantity.
    temporarySelectedItemsFind(_id: string): Item {
        return this.temporarySelectedItems.find(a => a._id === _id);
    }
}

@Component({
    selector: 'delete-confirmation-dialog',
    templateUrl: 'delete-confirmation-dialog.component.html',
})
export class DeleteConfirmationDialog {

    constructor(
        public dialogRef: MatDialogRef<DeleteConfirmationDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Item[]
    ) { }
  
    onNoClick(): void {
        this.dialogRef.close();
    }
}