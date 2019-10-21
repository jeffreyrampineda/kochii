import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { InventoryService } from 'src/app/services/inventory.service';
import { GroupsService } from 'src/app/services/groups.service';
import { Item } from 'src/app/interfaces/item';
import { GeneralDialogComponent } from 'src/app/components/dialogs/general-dialog/general-dialog.component';
import { DashboardComponent } from '../../dashboard.component';
import { Group } from 'src/app/interfaces/group';
import { MessageService } from 'src/app/services/message.service';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';

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
    groups: Group[];

    // Used for closing and opening side menu
    parentComponent: DashboardComponent;

    // Used for updating/removing items.
    itemUpdateForm: Object = {};
    option: string;

    constructor(
        private route: ActivatedRoute,
        private inventoryService: InventoryService,
        private messageService: MessageService,
        private groupsService: GroupsService,
        private location: Location,
        private injector: Injector,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
    ) {
        this.parentComponent = this.injector.get(DashboardComponent);
    }

// -------------------------------------------------------------

    ngOnInit() {
        // Set up inventory: MatTableDataSource with empty inital data
        this.inventory = new MatTableDataSource();
        this.inventory.paginator = this.paginator;
        this.inventory.sort = this.sort;

        // Used to sort data by expirationDate | asc.
        this.inventory.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'expirationDate': return new Date(item.expirationDate);
                default: return item[property];
            }
        };

        // Populate inventory.data with data
        this.getInventory();
        this.getGroups();
    }

    /**
     * Get all items then populate/refresh inventory.data for
     * presentation.
     */
    getInventory(): void {
        const groupName = this.route.snapshot.paramMap.get('groupName');
        this.groupName = groupName;

        this.inventoryService.getInventory(this.groupName).subscribe({
            next: response => {
                this.inventory.data = response;
            },
            error: err => {
                // Error
            },
            complete: () => {
                // TODO - stop loading.
            }
        });
    }

    getGroups(): void {
        this.groupsService.getGroups().subscribe({
            next: response => {
                this.groups = response;
            },
            error: err => {
                // Error
            },
            complete: () => {
                // TODO - stop loading.
            }
        });
    }

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
            catchError((error: any): Observable<any> => {
                return of(undefined);
            }),
        );
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

        forkJoin(observablesGroup).subscribe({
            next: response => {
                const successful = response.reduce((acc: number, curr) => {
                    if (curr) {
                        acc += 1;
                    }
                    return acc;
                }, 0);
                this.notify(`${successful}/${observablesGroup.length} items were successfully updated.`);
            },
            error: err => {
                // Error
            },
            complete: () => {
                this.getInventory();
                this.selectColumnToggle('');
            }
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
            this.itemUpdateForm = {};
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
                items: Object.values(this.itemUpdateForm).map<FormGroup[]>((form: FormGroup) => form.value),
                canConfirm: !this.checkIfInvalid(),
            }
        });

        // Confirmed.
        dialogRef.afterClosed().subscribe({
            next: (response: Item[]) => {
                if (response && response.length > 0) {
                    console.log(`Confirmed... ${this.option}`);
                    this.updateManyItem(response);
                }
            },
            error: err => {
                // Error
            },
            complete: () => {
                // TODO - stop loading.
            }
        });
    }

    /**
     * Adds extra functionality for SelectionModel.select(Item).
     * Also adds the specified item to itemUpdateForm object.
     * @param item - The item selected.
     */
    selectionSelect(item: Item): void {
        this.selection.select(item);

        // Stringify then parse to clone the values instead of reference.
        this.itemUpdateForm[item._id] = this.formBuilder.group({
            name: [item.name, [
              Validators.maxLength(20),
              Validators.required
            ]],
            quantity: [item.quantity, [
              Validators.min(1),
              Validators.required
            ]],
            addedDate: [item.addedDate, Validators.required],
            expirationDate: [item.expirationDate, Validators.required],
            group: [item.group, Validators.required],
        });
    }

    /**
     * Adds extra functionality for SelectionModel.clear().
     * Also clears the itemUpdateForm object.
     */
    selectionClear(): void {
        this.selection.clear();
        this.itemUpdateForm = {};
    }

    /**
     * Adds extra functionality for SelectionModel.toggle(Item).
     * Also adds the specified item to itemUpdateForm object
     * or removes the specified item from itemUpdateForm object.
     * @param item - The item to toggle.
     */
    selectionToggle(item: Item): void {
        this.selection.toggle(item);
        if (this.selection.isSelected(item)) {

            // Stringify then parse to clone the values instead of reference.
            this.selectionSelect(item);
        } else {
            delete this.itemUpdateForm[item._id];
        }
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

            forkJoin(observablesGroup).subscribe({
                next: response => {
                    this.deleteThisGroup();
                },
                error: err => {
                    // Error
                },
                complete: () => {
                    // TODO - stop loading.
                }
            });

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

    f(id) {
        return this.itemUpdateForm[id].controls;
    }

    /** Loops through itemAddForm and checks if any form is invalid.
     * @returns isInvalid - True if any form is invalid.
     */
    checkIfInvalid(): Boolean {
        let isInvalid = false;
        for (const form of Object.values(this.itemUpdateForm)) {
            if (form.invalid) {
                isInvalid = true;
            }
        }
        return isInvalid;
    }

    private deleteThisGroup(): void {
        console.log('delete group');
        this.groupsService.deleteGroup(this.groupName).subscribe({
            next: response => {
                if (response.ok === 1) {
                    this.back();
                }
            },
            error: err => {
                // Error
            },
            complete: () => {
                // TODO - stop loading.
            }
        });
    }

    private notify(message: string) {
        this.messageService.notify(message);
    }
}
