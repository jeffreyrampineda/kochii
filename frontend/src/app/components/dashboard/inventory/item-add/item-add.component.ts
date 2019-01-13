import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item';
import { Subject } from 'rxjs';
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
  itemAddForm: FormGroup;

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
    this.itemAddForm = this.formBuilder.group({
      name: ['', [
        Validators.maxLength(20),
        Validators.required
      ]], 
      quantity: [null, Validators.required],
      addedDate: [this.dateToday, Validators.required],
      expirationDate: [this.dateToday, Validators.required]
    });
  }

  onSubmit(): void {

    // stop here if form is invalid
    if (this.itemAddForm.invalid) {
        return;
    }

    this.addItem(this.itemAddForm.value);
  }

  // convenience getter for easy access to form fields
  get f() { return this.itemAddForm.controls; }

  addItem(newItem: Item): void {
    // Check if item with same name and expiration date exists.
    this.inventoryService.getItemByNameAndExpirationDate(newItem.name, newItem.expirationDate).subscribe(
      existingItem => {
        if(existingItem) {
          existingItem.quantity += newItem.quantity;
          this.updateItem(existingItem);
        } else {
          this.createNewItem(newItem)
        }
      }
    );
  }

  createNewItem(newItem: Item): void {
    // create new item.
    this.inventoryService.addItem(newItem).subscribe( 
      results => {
        console.log(results);
        this.router.navigate(['dashboard/inventory']);
      }
    );
  }

  updateItem(newItem: Item): void {
    this.inventoryService.updateItem(newItem).subscribe(
      results => {
        console.log(results);
        this.router.navigate(['dashboard/inventory']);
      }
    );
  }
}