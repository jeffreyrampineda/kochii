import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

// Components - Shared/Layouts
import { SharedModule } from './modules/shared/shared.module';
import { DashboardComponent } from './modules/shared/layouts/dashboard/dashboard.component';

// Components - Views
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { GroceriesComponent } from './views/groceries/groceries.component';
import { ActivityLogComponent } from './views/activity-log/activity-log.component';
import { InventoryComponent } from './views/inventory/inventory.component';
import { OverviewComponent } from './views/overview/overview.component';
import { SettingsComponent } from './views/settings/settings.component';
import { ItemAddComponent } from './views/item-add/item-add.component';
import { ItemUpdateComponent } from './views/item-update/item-update.component';
import { AccountComponent } from './views/account/account.component';

// -------------------------------------------------------------

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'inventory/add', component: ItemAddComponent },
      { path: 'inventory/:id', component: ItemUpdateComponent },
      { path: 'groceries', component: GroceriesComponent },
      {
        path: 'recipes',
        loadChildren: () =>
          import('./modules/recipes/recipes.module').then(
            (m) => m.RecipesModule
          ),
      },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', redirectTo: 'account', pathMatch: 'full' },
          { path: 'account', component: AccountComponent },
          { path: 'activity-log', component: ActivityLogComponent },
        ],
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
