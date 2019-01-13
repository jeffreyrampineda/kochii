import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { InventoryService } from 'src/app/services/inventory.service';
import { Item } from 'src/app/interfaces/item';

//-------------------------------------------------------------

@Component({
  selector: 'item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {

  dateToday = new Date();
  results: Object;
  searchTerm$ = new Subject<string>();
  itemAddForm: FormGroup[] = [];

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private formBuilder: FormBuilder
  ) {

    // Time is removed.
    this.dateToday.setHours(0,0,0,0);

    this.inventoryService.search(this.searchTerm$).subscribe(
      results => {
        this.results = results;
      }
    );
  }

//-------------------------------------------------------------

  ngOnInit() {
    this.itemAddForm.push(this.formBuilder.group({
      name: ['', [
        Validators.maxLength(20),
        Validators.required
      ]], 
      quantity: [null, Validators.required],
      addedDate: [this.dateToday, Validators.required],
      expirationDate: [this.dateToday, Validators.required]
    }));
  }

  /**
   * Submits each form then navigate to 'dashboard/inventory'
   * after each form has been submitted successfully.
   */
  onSubmit(): void {

    // Stop here if any form is invalid.
    if (this.checkIfInvalid()) {
        console.log("rejected");
        return;
    }

    let observablesGroup = [];

    this.itemAddForm.forEach(
      form => {
        observablesGroup.push(this.upsertItem(form.value));
      }
    );

    forkJoin(observablesGroup).subscribe(
      x => {
        console.log(x);
        this.router.navigate(['dashboard/inventory']);
      }
    );
  }

  /** Loops through itemAddForm and checks if any form is invalid.
   * @returns isInvalid - True if any form is invalid.
   */
  checkIfInvalid(): Boolean {
    let isInvalid = false;
    for (let form of this.itemAddForm) {
      if(form.invalid) {
        isInvalid = true;
      }
    };
    return isInvalid;
  }

  /**
   * Update the item with the same name and expirationDate,
   * If no item is found, create new item.
   * @param item - The item to be upserted.
   */
  upsertItem(newItem: Item): Observable<any> {
    return this.inventoryService.upsertItem(newItem).pipe(
      map(
        results => {
          return results;
        }
      )
    );
  }

  /** Adds more form for adding multiple items. */
  addMoreInput(): void {
    this.itemAddForm.push(this.formBuilder.group({
      name: ['', [
        Validators.maxLength(20),
        Validators.required
      ]], 
      quantity: [null, Validators.required],
      addedDate: [this.dateToday, Validators.required],
      expirationDate: [this.dateToday, Validators.required]
    }))
  }

  /** Convenience getter for easy access to form fields. */
  get f() { return this.itemAddForm[0].controls; }
}