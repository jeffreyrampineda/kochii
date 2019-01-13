import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { InventoryService } from 'src/app/services/inventory.service';
import { Item } from 'src/app/interfaces/item';

//-------------------------------------------------------------

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

//-------------------------------------------------------------

    ngOnInit() {
        this.getInventory();
    }

    /**
     * Get all items then sets up the inventory: MatTableDataSource for
     * presentation.
     */
    getInventory(): void {
        this.inventoryService.getInventory().subscribe(
            inventory => {
                this.inventory = new MatTableDataSource(inventory);
                this.inventory.paginator = this.paginator;
                this.inventory.sort = this.sort;

                // Used to sort data by expirationDate | asc.
                this.inventory.sortingDataAccessor = (item, property) => {
                    switch (property) {
                      case 'expirationDate': return new Date(item.expirationDate);
                      default: return item[property];
                    }
                };
            }
        );
    }

    /**
     * Delete the item with the specified id. If successful, update
     * the inventory for presentation.
     * @param _id - The id of the item to delete.
     */
    deleteItem(_id: string): void {
        this.inventoryService.deleteItem(_id).subscribe(
            results => {
                if(results.ok === 1) {
                    this.inventory.data = this.inventory.data.filter(i => i._id !== _id);
                }
            }
        );
    }

    /**
     * TODO -- replace with upsert by submitting -negative quantity.
     * 
     * Update the item with the same _id by deducting from quantity.
     * If quantity net amount is 0, delete the item.
     * @param quantityToRemove - The item with the amount of quantity to remove.
     */
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

    /**
     * TODO -- replace with forkJoin to wait for all update to finish for
     * final cleanups and client-side updating.
     * 
     * Loops through itemsNewValues and updates each item individually.
     * @param itemsNewValues - The array of items to be updated.
     */
    updateManyItemRemoveQuantity(itemsNewValues: Item[]): void {
        itemsNewValues.forEach(newValues => {
            this.updateItemRemoveQuantity(newValues);
        });
    }

    /**
     * Calculates the amount of days left before expiration.
     * @param date - The expiration date.
     * @returns diffDays - The number of days left.
     */
    expirationCountdown(date: string): number {
        const expirationDate = new Date(date);
        const today = new Date();
        const timeDiff = expirationDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    selectMasterToggle() {
      this.isAllSelected() ? this.selectionClear() : this.inventory.data.forEach(item => this.selectionSelect(item));
    }

    /** Toggles when to show the select checkboxes. */
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

    /** Opens the confirmation dialog for deleting items. */
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

    /**
     * Adds extra functionality for SelectionModel.select(Item).
     * Also pushes the specified item to temporarySelectedItems array.
     * @param item - The item selected.
     */
    selectionSelect(item: Item): void {
        this.selection.select(item);

        // Stringify then parse to clone the values instead of reference.
        this.temporarySelectedItems.push(JSON.parse(JSON.stringify(item)));
    }

    /**
     * Adds extra functionality for SelectionModel.clear().
     * Also clears the temporarySelectedItems array.
     */
    selectionClear(): void {
        this.selection.clear();
        this.temporarySelectedItems = [];
    }

    /**
     * Adds extra functionality for SelectionModel.toggle(Item).
     * Also pushes the specified item to temporarySelectedItems array
     * or removes the specified item from temporarySelectedItems array.
     * @param item - The item to toggle.
     */
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
    
    /**
     * Called by each selected row. Used to two-way bind quantity.
     * @param _id - The id to find in temporarySelectedItems array.
     * @returns Item - The item with the same id.
     */
    temporarySelectedItemsFind(_id: string): Item {
        return this.temporarySelectedItems.find(a => a._id === _id);
    }

    /**
     * Filters the inventory data by the specified filterValue. 
     * @param filterValue - The value to look for.
     */
    applyFilter(filterValue: string) {
        this.inventory.filter = filterValue.trim().toLowerCase();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.inventory.data.length;
      return numSelected === numRows;
    }
}

//-------------------------------------------------------------

@Component({
    selector: 'delete-confirmation-dialog',
    templateUrl: 'delete-confirmation-dialog.component.html',
})
export class DeleteConfirmationDialog {

    constructor(
        public dialogRef: MatDialogRef<DeleteConfirmationDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Item[]
    ) { }
  
//-------------------------------------------------------------

    /** Close this dialog without sending data. */
    onNoClick(): void {
        this.dialogRef.close();
    }
}