import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { ItemInstance } from '../../../interfaces/item-instance';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'quantity', 'expiration'];
    inventory: MatTableDataSource<ItemInstance>;

    constructor(
        private inventoryService: InventoryService) { }

    ngOnInit() {
        this.getInventory();
    }

    getInventory(): void {
        this.inventoryService.getInventory().subscribe(inventory => this.inventory = new MatTableDataSource(inventory));
    }

    daysFromToday(date): number {
        var expirationDate = new Date(date);
        var today = new Date();
        var timeDiff = Math.abs(expirationDate.getTime() - today.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }

    applyFilter(filterValue: string) {
        this.inventory.filter = filterValue.trim().toLowerCase();
    }
}
