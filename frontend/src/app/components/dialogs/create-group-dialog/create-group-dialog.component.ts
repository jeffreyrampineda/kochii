import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GroupsService } from 'src/app/services/groups.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// -------------------------------------------------------------

@Component({
    selector: 'kochii-create-group-dialog',
    templateUrl: 'create-group-dialog.component.html',
})
export class CreateGroupDialogComponent {

    loading = false;
    error = {
        name: undefined
    };
    form: FormGroup;

    constructor(
        private groupsService: GroupsService,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    ) {
        this.form = this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                Validators.pattern("^[a-zA-Z0-9 _-]*$")
            ]],
        });
    }

    // -------------------------------------------------------------

    /** Close this dialog without submitting. */
    onNoClick(): void {
        this.dialogRef.close();
    }

    /** Creates a group with form.value.name */
    onSubmit() {
        if (this.loading || this.form.invalid) {
            return;
        }
        this.loading = true;

        this.groupsService.createGroup(this.form.value.name).subscribe({
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

    get f() { return this.form.controls; }
}
