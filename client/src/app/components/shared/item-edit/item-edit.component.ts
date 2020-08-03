import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';
import { MessageService } from 'src/app/services/message.service';
import { Item } from 'src/app/interfaces/item';
import { UpdateDialogComponent } from 'src/app/components/shared/update-dialog/update-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'kochii-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  @Input() isAdding = false;
  @Input() title = '';

  private dateToday = new Date();
  itemEditForms: FormGroup[] = [];
  groups: string[] = [];
  firstFood = {};

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private inventoryService: InventoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    // Time is removed.
    this.dateToday.setHours(0, 0, 0, 0);
  }

  // -------------------------------------------------------------

  ngOnInit() {
    if (this.isAdding) {
      this.addMoreForms();
    }
    this.getGroups();
  }

  @Input()
  set item(val: Item) {
    if (val) this.addMoreForms(val);
  }

  /**
   * Submits each form then navigate to 'dashboard/inventory'
   * after each form has been submitted successfully.
   */
  onSubmit(): void {

    // Stop here if any form is invalid.
    if (this.checkIfInvalid()) {
      this.messageService.notify('Forms are invalid');
      return;
    }

    if (this.isAdding) {
      this.openEditDialog('Adding', 'Adding new items');
    } else {
      this.openEditDialog('Update', 'New values for the updated items');
    }
  }

  getGroups(): void {
    this.inventoryService.getGroups().subscribe({
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

  /** Loops through itemEditForms and checks if any form is invalid.
   * @returns isInvalid - True if any form is invalid.
   */
  checkIfInvalid(): Boolean {
    let isInvalid = false;
    for (const form of this.itemEditForms) {
      if (form.invalid) {
        isInvalid = true;
      }
    }
    return isInvalid;
  }

  /** Adds more form for adding multiple items. */
  addMoreForms(item: any = {}): void {
    this.itemEditForms.push(this.formBuilder.group({
      _id: {
        value: item._id || null,
        disabled: true
      },
      name: [item.name || 'New Item', [
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern("^[a-zA-Z0-9 _-]*$"),
        Validators.required
      ]],
      cost: [item.cost || '0.00', [
        Validators.min(0),
        Validators.max(999),
        Validators.required
      ]],
      quantity: [item.quantity || 1, [
        Validators.min(1),
        Validators.max(999),
        Validators.required
      ]],
      addedDate: [item.addedDate || this.dateToday, Validators.required],
      expirationDate: [item.addedDate || this.dateToday, Validators.required],
      group: [item.group || this.inventoryService.selectedGroup === "" ? "Default" : this.inventoryService.selectedGroup, Validators.required],
    }));
  }

  /**
   * Remove one of the form from the array specified by its index.
   * @param idx - the index to be removed.
   */
  removeInput(idx: number): void {
    this.itemEditForms.splice(idx, 1);
  }

  /** Convenience getter for easy access to form fields. */
  f(idx: number) { return this.itemEditForms[idx].controls; }

  checkNutrients(name: string): void {
    this.inventoryService.getNutrients(name).subscribe(result => {
      this.firstFood = result;
    });
  }

  /** Opens the update dialog. */
  openEditDialog(title: string, description: string): void {
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmation: ' + title,
        description: description,
        items: Object.values(this.itemEditForms).map((form: FormGroup) => form.getRawValue()),
        isAdding: this.isAdding,
        option: 'set'
      }
    });

    // Confirmed.
    dialogRef.afterClosed().subscribe({
      next: response => {
        if (response && response.successful) {
          this.messageService.notify(`${response.successful}/${response.total} items were successfully updated.`);
        }
      },
      error: err => {
        this.messageService.notify(err.error);
      },
      complete: () => {
        this.router.navigate(['app/inventory']);
      }
    });
  }
}
