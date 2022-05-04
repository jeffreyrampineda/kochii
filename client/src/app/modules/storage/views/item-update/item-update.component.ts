import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/interfaces/item';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'kochii-item-update',
  templateUrl: './item-update.component.html',
})
export class ItemUpdateComponent implements OnInit {
  item: Item;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
  ) { }

  ngOnInit(): void {
    this.getItemById(this.route.snapshot.paramMap.get('id'));
  }

  getItemById(id): void {
    this.inventoryService.getItemById(id).subscribe(result => {
      this.item = result;
    });
  }
}
