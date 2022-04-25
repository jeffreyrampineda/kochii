import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

// Components - views
import { DashboardComponent } from './components/layouts/dashboard/dashboard.component';
import { LoginComponent } from './components/views/login/login.component';
import { RegisterComponent } from './components/views/register/register.component';
import { GroceriesComponent } from './components/views/groceries/groceries.component';
import { ActivityLogComponent } from './components/views/activity-log/activity-log.component';
import { InventoryComponent } from './components/views/inventory/inventory.component';
import { OverviewComponent } from './components/views/overview/overview.component';
import { SettingsComponent } from './components/views/settings/settings.component';
import { ItemAddComponent } from './components/views/item-add/item-add.component';
import { ItemUpdateComponent } from './components/views/item-update/item-update.component';
import { AccountComponent } from './components/views/account/account.component';

// -------------------------------------------------------------

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'inventory/add', component: ItemAddComponent },
      { path: 'inventory/:id', component: ItemUpdateComponent },
      { path: 'groceries', component: GroceriesComponent },
      { path: 'settings', component: SettingsComponent,
        children: [
          { path: '', redirectTo: 'account', pathMatch: 'full' },
          { path: 'account', component: AccountComponent },
          { path: 'activity-log', component: ActivityLogComponent },
        ]},
      { path: '**', redirectTo: 'overview' }
    ]},
    { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
