import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InventoryService } from 'src/app/services/inventory.service';
import { GroupsService } from 'src/app/services/groups.service';
import { Item } from 'src/app/interfaces/item';
import { UpdateDialogComponent } from 'src/app/components/dialogs/update-dialog/update-dialog.component';
import { CreateGroupDialogComponent } from 'src/app/components/dialogs/create-group-dialog/create-group-dialog.component';
import { DashboardComponent } from '../dashboard.component';
import { MessageService } from 'src/app/services/message.service';

// -------------------------------------------------------------

@Component({
    selector: 'kochii-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnDestroy {

    private unsub = new Subject<void>();
    private parentComponent: DashboardComponent;    // Used for closing and opening side menu

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    displayedColumns: string[] = ['name', 'quantity', 'group', 'addedDate', 'expirationDate'];
    inventory: MatTableDataSource<Item>;
    showSelect: Boolean = false;
    selection: SelectionModel<Item> = new SelectionModel<Item>(true, []);
    groups: string[];

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
        this.getGroups();
        this.getItems();

        this.inventoryService.setSocketListeners();
        this.inventoryService.inventoryUpdate.pipe(takeUntil(this.unsub)).subscribe(() => {
            //this.getItems(); //Unnecessary
        });

        this.groupsService.setSocketListeners();
        this.groupsService.groupsUpdate.pipe(takeUntil(this.unsub)).subscribe(() => {
            //this.getGroups(); //Unnecessary
        });
    }

    ngOnDestroy() {
        this.unsub.next();
        this.unsub.complete();
    }

    getGroups(): void {
        this.groupsService.getGroups().subscribe({
            next: response => {
                this.groups = response;
            },
            error: () => {
                // Error
            },
            complete: () => {
                // TODO - stop loading.
            }
        });
    }

    /** Get all items in the inventory with the specified group. */
    getItems(): void {
        this.inventoryService.getItems(this.selectedGroup).subscribe({
            next: response => {
                this.inventory.data = response;
            },
            error: () => {
                // Error
            },
            complete: () => {
                // TODO - stop loading.
            }
        });
    }

    getGroupSize(name) {
        return this.inventoryService.getGroupSize(name);
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

    /** Deletes the selectedGroup from the server. */
    deleteGroup(): void {
        this.groupsService.deleteGroup(this.selectedGroup).subscribe({
            next: response => {
                if (response.name) {
                    this.notify(`'${response.name}' deleted`);
                }
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

    /** Opens the create group dialog. */
    openCreateGroupDialog(): void {
        const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
            width: '250px',
            data: { name: '' }
        });

        dialogRef.afterClosed().subscribe({
            next: response => {
                if (response && response.name) {
                    this.notify(`'${response.name}' created`);
                    this.selectedGroup = response.name;
                }
            },
            error: err => {
                this.notify(err.error);
            },
            complete: () => {
                this.getItems();
            }
        });
    }

    /** Opens the update dialog. */
    openUpdateDialog(title: string, description: string): void {
        const dialogRef = this.dialog.open(UpdateDialogComponent, {
            width: '400px',
            data: {
                title: 'Confirmation: ' + title,
                description: description,
                items: Object.values(this.itemUpdateForm).map<FormGroup[]>((form: FormGroup) => form.value),
                canConfirm: !this.checkIfInvalid(),
                option: this.option
            }
        });

        // Confirmed.
        dialogRef.afterClosed().subscribe({
            next: response => {
                if (response && response.successful) {
                    this.notify(`${response.successful}/${response.total} items were successfully updated.`);
                }
            },
            error: err => {
                this.notify(err.error);
            },
            complete: () => {
                this.getItems();
                this.selectColumnToggle('');
            }
        });
    }

    /** Checks whether inventory is empty or not */
    isEmpty(): boolean {
        return this.inventory.data.length === 0 ? true : false;
    }

    /** Checks whether the selectedGroup can be removed or not */
    canRemoveGroup(): boolean {
        return this.selectedGroup != "Default" && this.selectedGroup != "";
    }

    private notify(message: string) {
        this.messageService.notify(message);
    }
}
