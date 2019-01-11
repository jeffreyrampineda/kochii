import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { Item } from '../../../interfaces/item';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['select', 'name', 'quantity', 'expirationDate'];
    inventory: MatTableDataSource<Item>;
    selection = new SelectionModel<Item>(true, []);

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
                this.inventory.sort = this.sort;
                this.inventory.sortingDataAccessor = (item, property) => {
                    switch (property) {
                      case 'expirationDate': return new Date(item.expirationDate);
                      default: return item[property];
                    }
                };
            }
        );
    }

    expirationCountdown(date: string): number {
        const expirationDate = new Date(date);
        const today = new Date();
        const timeDiff = expirationDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }

    applyFilter(filterValue: string) {
        this.inventory.filter = filterValue.trim().toLowerCase();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.inventory.data.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.inventory.data.forEach(row => this.selection.select(row));
    }
}
