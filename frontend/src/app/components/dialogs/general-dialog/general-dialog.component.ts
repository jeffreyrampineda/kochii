import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// -------------------------------------------------------------

@Component({
    selector: 'kochii-general-dialog',
    templateUrl: 'general-dialog.component.html',
  })
  export class GeneralDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<GeneralDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

  // -------------------------------------------------------------

    /** Close this dialog without sending data. */
    onNoClick(): void {
        this.dialogRef.close();
    }
  }
