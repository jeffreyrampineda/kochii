import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Router } from '@angular/router';
import { ItemInstance } from 'src/app/interfaces/item-instance';
import { Subject } from 'rxjs';

const TODAY = new Date();
const DEFAULT_EXPIRATION = new Date().setDate(TODAY.getDate() + 7);

@Component({
  selector: 'add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  itemModel: ItemInstance = new ItemInstance(99, "New Item", 99, TODAY, DEFAULT_EXPIRATION);
  results: Object;
  searchTerm$ = new Subject<string>();
  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {
    this.inventoryService.search(this.searchTerm$)
      .subscribe(results => {
        this.results = results;
      });
  }
  ngOnInit() { }

  addItem(): void {
    this.inventoryService.addItem(this.itemModel).subscribe(()=> {
      this.router.navigate(['dashboard/inventory']);
    })
  }
}