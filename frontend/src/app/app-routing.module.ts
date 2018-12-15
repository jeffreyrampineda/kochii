import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


//--------- main
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecipeArchiveComponent } from './components/recipe-archive/recipe-archive.component';

//--------- dashboard
import { OverviewComponent } from './components/dashboard/overview/overview.component';
import { InventoryComponent } from './components/dashboard/inventory/inventory.component';
import { RecipesComponent } from './components/dashboard/recipes/recipes.component';
import { GroceriesComponent } from './components/dashboard/groceries/groceries.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';
import { HistoryComponent } from './components/dashboard/history/history.component';

//--------- etc
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AddItemComponent } from './components/dashboard/inventory/add-item.component';
import { ItemComponent } from './components/dashboard/inventory/item.component';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, 
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'inventory/add', component: AddItemComponent },
      { path: 'inventory/:id', component: ItemComponent },
      { path: 'recipes', component: RecipesComponent },
      { path: 'recipes/:id', component: RecipesComponent },
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