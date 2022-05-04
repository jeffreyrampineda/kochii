import { Component } from '@angular/core';
import { Item } from 'src/app/interfaces/item';
import { InventoryService } from 'src/app/services/inventory.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-item-add',
  templateUrl: './item-add.component.html',
})
export class ItemAddComponent {
  item: Item;

  constructor(
    private inventoryService: InventoryService,
  ) {
    const dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);
    this.item = {
      name: 'New Item',
      quantity: 1,
      cost: 0,
      addedDate: dateToday,
      expirationDate: dateToday,
      group: this.inventoryService.selectedGroup === '' ? 'Default' : this.inventoryService.selectedGroup,
    };
  }
}
