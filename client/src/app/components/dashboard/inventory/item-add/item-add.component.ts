import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { InventoryService } from 'src/app/services/inventory.service';
import { GroupsService } from 'src/app/services/groups.service';
import { Item } from 'src/app/interfaces/item';
import { MessageService } from 'src/app/services/message.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {

  dateToday = new Date();
  existingItems: Item[];
  searchTerm = new Subject<string>();
  itemAddForm: FormGroup[] = [];
  groups: string[];
  placeholderImage = 'app/assets/image-placeholder.png';
  selectedGroup = "Default";
  selectedFormIdx = 0;

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private messageService: MessageService,
    private groupsService: GroupsService,
    private formBuilder: FormBuilder
  ) {

    // Time is removed.
    this.dateToday.setHours(0, 0, 0, 0);

    this.inventoryService.search(this.searchTerm).subscribe({
      next: response => {
        this.existingItems = response;
      },
      error: err => {
        // Error
      },
      complete: () => {
        // TODO - stop loading.
      }
    });
  }

  // -------------------------------------------------------------

  ngOnInit() {
    this.selectedGroup = this.inventoryService.selectedGroup === "" ? "Default" : this.inventoryService.selectedGroup;
    this.addMoreInput();
    this.getGroups();
  }

  /**
   * Submits each form then navigate to 'dashboard/inventory'
   * after each form has been submitted successfully.
   */
  onSubmit(): void {

    // Stop here if any form is invalid.
    if (this.checkIfInvalid()) {
      this.notify('Forms are invalid');
      return;
    }

    const observablesGroup = [];

    let duplicates = {};
    let hasDuplicate = false;

    this.itemAddForm.forEach(
      form => {
        if (duplicates[form.value.name + form.value.expirationDate.toDateString()]) {
          hasDuplicate = true;
        }
        duplicates[form.value.name + form.value.expirationDate.toDateString()] = true;

        observablesGroup.push(this.createItem(form.value));
      }
    );

    if (hasDuplicate) {
      this.notify('Duplicates found');
      return;
    }

    forkJoin(observablesGroup).subscribe({
      next: response => {
        const successful = response.reduce((acc: number, curr) => {
          // Only increment if it's not undefined.
          if (curr) {
            acc += 1;
          }
          return acc;
        }, 0);
        const total = observablesGroup.length;
        this.notify(`${successful}/${total} items were successfully added.`);
      },
      error: err => {
        // forkJoin handle error
      },
      complete: () => {
        this.router.navigate(['app/inventory']);
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

  /** Loops through itemAddForm and checks if any form is invalid.
   * @returns isInvalid - True if any form is invalid.
   */
  checkIfInvalid(): Boolean {
    let isInvalid = false;
    for (const form of this.itemAddForm) {
      if (form.invalid) {
        isInvalid = true;
      }
    }
    return isInvalid;
  }

  /**
   * Update the item with the same name and expirationDate,
   * If no item is found, create new item.
   * @param item - The item to be upserted.
   */
  createItem(newItem: Item): Observable<any> {
    return this.inventoryService.createItem(newItem).pipe(
      catchError((error: any): Observable<any> => {
        // Return undefined to complete forkJoin.
        return of(undefined);
      }),
    );
  }

  /** Adds more form for adding multiple items. */
  addMoreInput(): void {
    this.itemAddForm.push(this.formBuilder.group({
      name: ['New Item', [
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern("^[a-zA-Z0-9 _-]*$"),
        Validators.required
      ]],
      cost: ['0.00', [
        Validators.min(0),
        Validators.required
      ]],
      quantity: ['1', [
        Validators.min(1),
        Validators.max(999),
        Validators.required
      ]],
      addedDate: [this.dateToday, Validators.required],
      expirationDate: [this.dateToday, Validators.required],
      group: [this.selectedGroup, Validators.required],
    }));
    this.selectForm(this.itemAddForm.length - 1);
  }

  selectForm(idx: number): void {
    this.selectedFormIdx = idx;
  }

  /**
   * Remove one of the form from the array specified by its index.
   * @param index - the index to be removed.
   */
  removeInput(index: number): void {
    this.selectForm(index - 1);
    this.itemAddForm.splice(index, 1);
  }

  /** Navigate the browser back to dashboard/inventory */
  back(): void {
    this.router.navigate(['app/inventory']);
  }

  /** Convenience getter for easy access to form fields. */
  get f() { return this.itemAddForm[this.selectedFormIdx].controls; }

  /** Getter for the selected form's name */
  get selectedFormName(): string {
    return this.itemAddForm[this.selectedFormIdx].value.name;
  }

  private notify(message: string) {
    this.messageService.notify(message);
  }
}
