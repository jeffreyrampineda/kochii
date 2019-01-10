import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item';
import { Subject } from 'rxjs';

const TODAY = new Date();
const DEFAULT_EXPIRATION = new Date().setDate(TODAY.getDate() + 7);

@Component({
  selector: 'item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {

  itemModel: Item;
  results: Object;
  searchTerm$ = new Subject<string>();
  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {
    this.itemModel = {
      name: "New Item", 
      quantity: 1, 
      addedDate: TODAY, 
      expirationDate: TODAY
    }
    this.inventoryService.search(this.searchTerm$).subscribe(
      results => {
        this.results = results;
      }
    );
  }
  ngOnInit() { }

  addItem(): void {
    this.inventoryService.addItem(this.itemModel).subscribe( 
      results => {
        console.log(results);
        this.router.navigate(['dashboard/inventory']);
      }
    );
  }
}