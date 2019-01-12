import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item';
import { Subject } from 'rxjs';

@Component({
  selector: 'item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {

  dateToday = new Date();
  itemModel: Item;
  results: Object;
  searchTerm$ = new Subject<string>();
  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {

    // time precision is not necessary.
    this.dateToday.setHours(0,0,0,0);

    this.itemModel = {
      name: "New Item", 
      quantity: 1, 
      addedDate: this.dateToday, 
      expirationDate: this.dateToday
    }
    this.inventoryService.search(this.searchTerm$).subscribe(
      results => {
        this.results = results;
      }
    );
  }
  ngOnInit() { }

  addItem(): void {
    // Check if item with same name and expiration date exists.
    this.inventoryService.getItemByNameAndExpirationDate(this.itemModel.name, this.itemModel.expirationDate).subscribe(
      results => {
        if(results) {
          results.quantity += this.itemModel.quantity;
          this.updateItem(results);
        } else {
          this.createNewItem()
        }
      }
    );
  }

  createNewItem(): void {
    // create new item.
    this.inventoryService.addItem(this.itemModel).subscribe( 
      results => {
        console.log(results);
        this.router.navigate(['dashboard/inventory']);
      }
    );
  }

  updateItem(item: Item): void {
    this.inventoryService.updateItem(item).subscribe(
      results => {
        console.log(results);
        this.router.navigate(['dashboard/inventory']);
      }
    );
  }
}