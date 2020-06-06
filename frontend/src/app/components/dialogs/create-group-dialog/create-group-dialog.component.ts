import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from 'src/app/services/groups.service';

// -------------------------------------------------------------

@Component({
    selector: 'kochii-create-group-dialog',
    templateUrl: 'create-group-dialog.component.html',
})
export class CreateGroupDialogComponent {

    loading = false;
    error = {};

    constructor(
        private groupsService: GroupsService,
        public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    // -------------------------------------------------------------

    /** Close this dialog without sending data. */
    onNoClick(): void {
        this.dialogRef.close();
    }

    /** Creates a group with data.name */
    onSubmit() {
        if (this.loading) {
            return;
        }
        this.loading = true;

        this.groupsService.createGroup(this.data.name).subscribe({
            next: response => {
                if (response.name) {
                    this.dialogRef.close(response);
                }
            },
            error: err => {
                this.error = err.error;
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
}
