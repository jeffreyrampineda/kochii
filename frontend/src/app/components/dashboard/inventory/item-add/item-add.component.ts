import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item';
import { Subject, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

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

    // time precision is not necessary.
    this.dateToday.setHours(0,0,0,0);

    this.inventoryService.search(this.searchTerm$).subscribe(
      results => {
        this.results = results;
      }
    );
  }
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

  onSubmit(): void {

    // stop here if form is invalid
    if (this.checkIfInvalid()) {
        console.log("rejected");
        return;
    }
    let observables = [];

    this.itemAddForm.forEach(
      form => {

        // Adds each item
        observables.push(this.upsertItem(form.value));
      }
    );

    forkJoin(observables).subscribe(
      x => {
        console.log(x);
        this.router.navigate(['dashboard/inventory']);
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() { return this.itemAddForm[0].controls; }

  checkIfInvalid(): Boolean {
    let g = false;
    for (let form of this.itemAddForm) {
      if(form.invalid) {
        g = true;
      }
    };
    return g;
  }

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

  upsertItem(newItem: Item): Observable<any> {
    return this.inventoryService.upsertItem(newItem).pipe(
      map(
        results => {
          return results;
        }
      )
    );
  }
}