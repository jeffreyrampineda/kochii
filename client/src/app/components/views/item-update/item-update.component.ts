import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/interfaces/item';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'kochii-item-update',
  templateUrl: './item-update.component.html',
  styleUrls: ['./item-update.component.css']
})
export class ItemUpdateComponent implements OnInit {

  item: Item;

  constructor(
    private activatedRoute: ActivatedRoute,
    private inventoryService: InventoryService,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    this.getItemById(id);
  }

  getItemById(id): void {
    this.inventoryService.getItemById(id).subscribe(result => {
      this.item = result;
    });
  }
}
