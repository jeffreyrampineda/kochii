import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/interfaces/item';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-item-update',
  templateUrl: './item-update.component.html',
})
export class ItemUpdateComponent implements OnInit {
  item!: Item;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getItemById(id);
    }
  }

  getItemById(id: string): void {
    this.inventoryService.getItemById(id).subscribe((result) => {
      this.item = result;
    });
  }
}
