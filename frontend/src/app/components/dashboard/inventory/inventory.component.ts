import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { Item } from '../../../interfaces/item';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ['id', 'name', 'quantity', 'expiration'];
    inventory: MatTableDataSource<Item>;

    constructor(
        private inventoryService: InventoryService
    ) { }

    ngOnInit() {
        this.getInventory();
    }

    getInventory(): void {
        this.inventoryService.getInventory().subscribe(
            inventory => {
                this.inventory = new MatTableDataSource(inventory);
                this.inventory.paginator = this.paginator;
            }
        );
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
