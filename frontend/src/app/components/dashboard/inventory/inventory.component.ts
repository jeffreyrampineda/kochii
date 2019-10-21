import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { InventoryService } from 'src/app/services/inventory.service';
import { GroupsService } from 'src/app/services/groups.service';
import { Group } from 'src/app/interfaces/group';
import { Item } from 'src/app/interfaces/item';

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

    groups: Group[] = [];
    inventory: Item[] = [];

    constructor(
        private dialog: MatDialog,
        private inventoryService: InventoryService,
        private groupsService: GroupsService,
    ) { }

// -------------------------------------------------------------

    ngOnInit() {
        this.getGroups();
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

    getInventory(): void {
        this.inventoryService.getInventory().subscribe({
            next: response => {
                this.inventory = response;
            },
            error: err => {
                // Error
            },
            complete: () => {
                // TODO - stop loading.
            }
        });
    }

    addGroup(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: { name: '', size: 0 }
        });

        dialogRef.afterClosed().subscribe({
            next: response => {
                if (response && response !== '') {
                    this.groupsService.addGroup(response).subscribe();
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
