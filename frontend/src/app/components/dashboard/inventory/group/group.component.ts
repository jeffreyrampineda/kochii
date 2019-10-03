import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { InventoryService } from 'src/app/services/inventory.service';
import { Item } from 'src/app/interfaces/item';
import { GeneralDialogComponent } from 'src/app/components/dialogs/general-dialog/general-dialog.component';
import { DashboardComponent } from '../../dashboard.component';
import { Group } from 'src/app/interfaces/group';

// -------------------------------------------------------------

@Component({
    selector: 'kochii-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    groupName: string;
    displayedColumns: string[] = ['name', 'quantity', 'group', 'addedDate', 'expirationDate'];
    inventory: MatTableDataSource<Item>;
    showSelect: Boolean = false;
    selection: SelectionModel<Item> = new SelectionModel<Item>(true, []);
    localGroups: Group[];

    // Used for closing and opening side menu
    parentComponent: DashboardComponent;

    // Used for updating/removing items.
    temporarySelectedItems: Item[] = [];
    option: string;

    constructor(
        private route: ActivatedRoute,
        private inventoryService: InventoryService,
        private location: Location,
        private injector: Injector,
        public dialog: MatDialog,
    ) {
        this.parentComponent = this.injector.get(DashboardComponent);
    }

// -------------------------------------------------------------

    ngOnInit() {
        this.getInventory();
        this.getGroups();
    }

    /**
     * Get all items then sets up the inventory: MatTableDataSource for
     * presentation.
     */
    getInventory(): void {
        const groupName = this.route.snapshot.paramMap.get('groupName');
        this.groupName = groupName;

        this.inventoryService.getInventory(this.groupName).subscribe(inventory => {
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
        });
    }

    getGroups(): void {
        this.inventoryService.getGroups().subscribe(gro => {
            this.localGroups = gro;
        });
    }

    /**
     * Delete the item with the specified id. If successful, update
     * the inventory for presentation.
     * @param _id - The id of the item to delete.
     */
/*     deleteItem(_id: string): void {
        this.inventoryService.deleteItem(_id).subscribe(
            results => {
                if (results.ok === 1) {
                    this.inventory.data = this.inventory.data.filter(i => i._id !== _id);
                }
            }
        );
    } */

    /**
     * Update the item with the same name and expirationDate.
     * Option declares whether to set or inc.
     * @param newItem - The item to be updated.
     */
    updateItem(newItem: Item): Observable<any> {
        if (this.option === 'inc') {
            console.log('Deducting quantity');
            newItem.quantity = -newItem.quantity;
        }

        return this.inventoryService.updateItem(newItem, this.option).pipe(
            map(
                results => {
                    if (results) {
                        // If item is updated.
                        if (results._id) {
                            if (this.option === 'inc') {
                                this.inventory.data.find(i => i._id === results._id).quantity += newItem.quantity;
                            } else if (this.option === 'set') {
                                const ref = this.inventory.data.find(i => i._id === results._id);
                                ref.quantity = newItem.quantity;
                                ref.quantityType = newItem.quantityType;
                                if (newItem.group !== this.groupName) {
                                    this.removeItemFromLocalInventoryById(ref._id);
                                }
                            }
                        } else if (results.n === 1) {
                            // If item is deleted.
                            this.inventory.data = this.inventory.data.filter(i => i._id !== newItem._id);
                        }
                    }
                    return results;
                }
            )
        );
    }

    removeItemFromLocalInventoryById(id: string): void {
        this.inventory.data = this.inventory.data.filter(i => i._id !== id);
    }

    /**
     * Loops through newItems and update each item individually.
     * @param newItems - The array of items to be updated.
     */
    updateManyItem(newItems: Item[]): void {
        const observablesGroup = [];

        newItems.forEach(
            newItem => {
              observablesGroup.push(this.updateItem(newItem));
            }
          );

        forkJoin(observablesGroup).subscribe(
            x => {
                console.log(x);
                this.selectColumnToggle('');
            }
        );
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

    /** Toggles when to show the select checkboxes.
     *  @param option - Can be 'inc', 'set' or ''.
     */
    selectColumnToggle(option: string) {
        this.showSelect = !this.showSelect;
        if (this.showSelect) {
            this.displayedColumns.unshift('select');
            this.option = option;
            this.parentComponent.opened = false;
        } else {
            this.temporarySelectedItems = [];
            this.selection.clear();
            this.displayedColumns.shift();
            this.option = '';
            this.parentComponent.opened = true;
        }
    }

    /** Opens the confirmation dialog. */
    openConfirmationDialog(title: string, description: string): void {
        const dialogRef = this.dialog.open(GeneralDialogComponent, {
            width: '250px',
            data: {
                title: 'Confirmation: ' + title,
                description: description,
                items: this.temporarySelectedItems,
                canConfirm: true
            }
        });

        // Confirmed.
        dialogRef.afterClosed().subscribe(
            result => {
                if (result && result.length > 0) {
                    console.log(`Confirmed... ${this.option}`);
                    this.updateManyItem(result);
                }
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
        if (this.selection.isSelected(item)) {

            // Stringify then parse to clone the values instead of reference.
            this.temporarySelectedItems.push(JSON.parse(JSON.stringify(item)));
        } else {
            const idx = this.temporarySelectedItems.findIndex(a => a._id === item._id);
            if (idx > -1) {
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

    back(): void {
        this.location.back();
    }

    // TODO - move updateItem to inventory.service's deleteGroup().
    deleteGroup(): void {
        if (this.groupName === 'Default') {
            console.log('cannot remove default group');
            return;
        }

        if (this.inventory.data.length !== 0) {
            console.log('group is not empty');
            const rogueItems = JSON.parse(JSON.stringify(this.inventory.data));

            rogueItems.forEach(i => {
                i.group = 'Default';
            });

            // TODO - simplify updateManyItems(). remove subscribe in the function
            // make it return Observable so it can be used in other functions with subscribe
            const observablesGroup = [];

            rogueItems.forEach(r => {
                observablesGroup.push(this.inventoryService.updateItem(r, 'set').pipe(
                    map(results => {
                        return results;
                    })
                ));
            });

            forkJoin(observablesGroup).subscribe(
                x => {
                    this.deleteThisGroup();
                }
            );

        } else {
            this.deleteThisGroup();
        }
    }

    generateStatusLabel(date: string): string {
        const d = this.expirationCountdown(date.toString());

        if (d > 10) {
            return 'good';
        } else if (d < 10 && d >= 0) {
            return 'warning';
        }
        return 'expired';
    }

    private deleteThisGroup(): void {
        console.log('delete group');
        this.inventoryService.deleteGroup(this.groupName).subscribe(results => {
            if (results.ok === 1) {
                this.back();
            }
        });
    }
}
