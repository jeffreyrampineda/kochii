import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { RecipeArchiveComponent } from './components/recipe-archive/recipe-archive.component';
import { RegisterComponent } from './components/register/register.component';

// Components - /dashboard
import { GroceriesComponent } from './components/dashboard/groceries/groceries.component';
import { HistoryComponent } from './components/dashboard/history/history.component';
import { InventoryComponent } from './components/dashboard/inventory/inventory.component';
import { OverviewComponent } from './components/dashboard/overview/overview.component';
import { RecipesComponent } from './components/dashboard/recipes/recipes.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';

// Components - /dashboard/inventory
import { ItemAddComponent } from './components/dashboard/inventory/item-add/item-add.component';
import { ItemDetailComponent } from './components/dashboard/inventory/item-detail/item-detail.component';

// Components - /dashboard/recipes
import { RecipeDetailComponent } from './components/dashboard/recipes/recipe-detail/recipe-detail.component';

// -------------------------------------------------------------

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'inventory/add', component: ItemAddComponent },
      { path: 'inventory/:id', component: ItemDetailComponent },
      { path: 'recipes', component: RecipesComponent },
      { path: 'recipes/:id', component: RecipeDetailComponent },
      { path: 'groceries', component: GroceriesComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'history', component: HistoryComponent },
      { path: '**', redirectTo: 'overview' }
    ]},
  { path: 'recipe-archive', component: RecipeArchiveComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
