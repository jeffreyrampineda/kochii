import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { ItemInstance } from '../../../interfaces/item-instance';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    items: ItemInstance[];

    constructor(private inventoryService: InventoryService) {
        this.items = [];
    }

    ngOnInit() {
        this.getInventory();
    }

    getInventory(): void {
        this.inventoryService.getInventory()
            .subscribe(items => this.items = items);
    }

    daysFromToday(date): number {
        var expirationDate = new Date(date);
        var today = new Date();
        var timeDiff = Math.abs(expirationDate.getTime() - today.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }
}
