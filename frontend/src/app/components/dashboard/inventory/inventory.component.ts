import { Component, OnInit, Inject, ViewChild, Injector } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { InventoryService } from 'src/app/services/inventory.service';
import { GroupsService } from 'src/app/services/groups.service';
import { Item } from 'src/app/interfaces/item';
import { GeneralDialogComponent } from 'src/app/components/dialogs/general-dialog/general-dialog.component';
import { DashboardComponent } from '../dashboard.component';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

export interface DialogData {
    groupName: string;
}

// -------------------------------------------------------------

@Component({
    selector: 'kochii-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    displayedColumns: string[] = ['name', 'quantity', 'group', 'addedDate', 'expirationDate'];
    inventory: MatTableDataSource<Item>;
    showSelect: Boolean = false;
    selection: SelectionModel<Item> = new SelectionModel<Item>(true, []);
    groups: string[];

    // Used for closing and opening side menu
    parentComponent: DashboardComponent;

    // Used for updating/removing items.
    itemUpdateForm: Object = {};
    option: string;

    selectedGroup: string = '';

    constructor(
        private dialog: MatDialog,
        private inventoryService: InventoryService,
        private messageService: MessageService,
        private groupsService: GroupsService,
        private injector: Injector,
        private formBuilder: FormBuilder,
        private socketioService: SocketioService,
    ) {
        this.parentComponent = this.injector.get(DashboardComponent);
    }

// -------------------------------------------------------------

    ngOnInit() {
        this.socketioService.initSocket();

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
        this.getGroups();
        this.getItems();
        

        this.inventoryService.onItemCreate().subscribe(result => {
            this.getItems();
        });
        this.inventoryService.onItemUpdate().subscribe();
        this.inventoryService.onItemUpdateMany().subscribe();
        this.inventoryService.onItemDelete().subscribe(result => {
            this.getItems();
        });

        this.groupsService.onGroupCreate().subscribe(result => {
            this.getGroups();
        });
        this.groupsService.onGroupDelete().subscribe(result => {
            this.getGroups();
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
     * Get all items in the inventory with the specified group.
     */
    getItems(): void {
        this.inventoryService.getItems(this.selectedGroup).subscribe({
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

    getGroupSize(name) {
        return this.inventoryService.getGroupSize(name);
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
                this.getItems();
                this.selectColumnToggle('');
            }
        });
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
            _id: item._id,
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

    // TODO - move updateItem to inventory.service's deleteGroup().
    deleteGroup(): void {
        this.groupsService.deleteGroup(this.selectedGroup).subscribe({  
            next: response => {

            },
            error: err => {
                this.notify(err.error);
            },
            complete: () => {
                // TODO - stop loading.
                this.selectedGroup = '';
                this.getGroups();
                this.getItems();
            }
        });
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

    createGroup(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: { name: '' }
        });

        dialogRef.afterClosed().subscribe({
            next: response => {
                if (response && response !== '') {
                    this.groupsService.createGroup(response.name).subscribe({
                        next: res => {
                            if (res.name) {
                                this.selectedGroup = res.name;
                                this.getItems();
                            }
                        }
                    });
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

@Component({
    selector: 'kochii-dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.component.html',
})
export class DialogOverviewExampleDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
