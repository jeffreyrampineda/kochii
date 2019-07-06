import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { InventoryService } from 'src/app/services/inventory.service';
import { Group } from 'src/app/interfaces/group';

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

    constructor(
        private dialog: MatDialog,
        private inventoryService: InventoryService,
    ) { }

// -------------------------------------------------------------

    ngOnInit() {
        this.getGroups();
    }

    getGroups(): void {
        this.inventoryService.getGroups().subscribe(
            groups => {
                this.groups = groups;
            }
        );
    }

    addGroup(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: { groupName: '' }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result !== '') {
                this.inventoryService.addGroup(result).subscribe(
                    x => {
                        console.log(x);
                        this.groups.push(x);
                    }
                );
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
