import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { StorageRoutingModule } from './storage-routing.module';

// Pipes
import { CountdownPipe } from './pipes/countdown.pipes';
import { ExpirationPipe } from './pipes/expiration.pipes';
import { StatusPipe } from './pipes/status.pipes';

// Components
import { ItemEditComponent } from './components/item-edit/item-edit.component';
import { CreateGroupDialogComponent } from './components/create-group-dialog/create-group-dialog.component';

// Views
import { InventoryComponent } from './views/inventory/inventory.component';
import { ItemAddComponent } from './views/item-add/item-add.component';
import { ItemUpdateComponent } from './views/item-update/item-update.component';
import { GroceriesComponent } from './views/groceries/groceries.component';

@NgModule({
  declarations: [
    CountdownPipe,
    ExpirationPipe,
    StatusPipe,
    ItemEditComponent,
    CreateGroupDialogComponent,
    InventoryComponent,
    ItemAddComponent,
    ItemUpdateComponent,
    GroceriesComponent,
  ],
  imports: [SharedModule, StorageRoutingModule],
})
export class StorageModule {}
