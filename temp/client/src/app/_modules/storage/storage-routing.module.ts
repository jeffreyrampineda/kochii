import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Views
import { InventoryComponent } from './_views/inventory/inventory.component';
import { GroceriesComponent } from './_views/groceries/groceries.component';
import { ItemAddComponent } from './_views/item-add/item-add.component';
import { ItemUpdateComponent } from './_views/item-update/item-update.component';

const routes: Routes = [
  { path: '', redirectTo: 'ivnentory', pathMatch: 'full' },
  { path: 'inventory', component: InventoryComponent },
  { path: 'inventory/add', component: ItemAddComponent },
  { path: 'inventory/:id', component: ItemUpdateComponent },
  { path: 'groceries', component: GroceriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageRoutingModule {}
