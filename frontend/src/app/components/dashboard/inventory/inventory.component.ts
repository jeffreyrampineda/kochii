import { Component, OnInit } from '@angular/core';

import { InventoryService } from 'src/app/services/inventory.service';
import { Group } from 'src/app/interfaces/group';

// -------------------------------------------------------------

@Component({
    selector: 'kochii-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    groups: Group[] = [];

    constructor(
        private inventoryService: InventoryService,
    ) { }

// -------------------------------------------------------------

    ngOnInit() {
        this.getGroups();
    }

    getGroups(): void {
        this.inventoryService.getGroups().subscribe(
            groups => {
                this.groups = groups;
            }
        );
    }
}
