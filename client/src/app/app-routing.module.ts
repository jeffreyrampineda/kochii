import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

// Layouts
import { DashboardComponent } from './_layouts/dashboard/dashboard.component';

// Views
import { LoginComponent } from './_views/login/login.component';
import { RegisterComponent } from './_views/register/register.component';
import { ActivityLogComponent } from './_views/activity-log/activity-log.component';
import { OverviewComponent } from './_views/overview/overview.component';
import { SettingsComponent } from './_views/settings/settings.component';
import { AccountComponent } from './_views/account/account.component';

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
      {
        path: 'storage',
        loadChildren: () =>
          import('./modules/storage/storage.module').then(
            (m) => m.StorageModule
          ),
      },
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
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
