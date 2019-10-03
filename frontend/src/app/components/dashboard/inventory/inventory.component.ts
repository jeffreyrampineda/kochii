import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { InventoryService } from 'src/app/services/inventory.service';
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

    localGroups: Group[] = [];
    localInv: Item[] = [];

    constructor(
        private dialog: MatDialog,
        private inventoryService: InventoryService,
    ) { }

// -------------------------------------------------------------

    ngOnInit() {
        this.getGroups();
    }

    getGroups(): void {
        this.inventoryService.getGroups().subscribe(gro => {
            this.localGroups = gro;
        });
    }

    getInventory(): void {
        this.inventoryService.getInventory().subscribe(inv => {
            this.localInv = inv;
        });
    }

    addGroup(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: { name: '', size: 0 }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result !== '') {
                this.inventoryService.addGroup(result).subscribe(x => {
                    console.log(x);
                });
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
