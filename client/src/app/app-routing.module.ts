import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

// Components - views
import { DashboardComponent } from './components/layouts/dashboard/dashboard.component';
import { LoginComponent } from './components/views/login/login.component';
import { RegisterComponent } from './components/views/register/register.component';
import { GroceriesComponent } from './components/views/groceries/groceries.component';
import { HistoryComponent } from './components/views/history/history.component';
import { InventoryComponent } from './components/views/inventory/inventory.component';
import { OverviewComponent } from './components/views/overview/overview.component';
import { SettingsComponent } from './components/views/settings/settings.component';
import { ItemAddComponent } from './components/views/item-add/item-add.component';
import { ItemUpdateComponent } from './components/views/item-update/item-update.component';

// -------------------------------------------------------------

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: 'app', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'inventory/add', component: ItemAddComponent },
      { path: 'inventory/:id', component: ItemUpdateComponent },
      { path: 'groceries', component: GroceriesComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'history', component: HistoryComponent },
      { path: '**', redirectTo: 'overview' }
    ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'app' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
