import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Pipes
import { ExpirationPipe } from './pipes/expiration.pipes';

// App-level
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
import {
  InventoryComponent,
  ConfirmationDialogComponent
} from './components/dashboard/inventory/inventory.component';
import { OverviewComponent } from './components/dashboard/overview/overview.component';
import { RecipesComponent } from './components/dashboard/recipes/recipes.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';

// Components - /dashboard/inventory
import { ItemAddComponent } from './components/dashboard/inventory/item-add/item-add.component';
import { ItemDetailComponent } from './components/dashboard/inventory/item-detail/item-detail.component';

// Components - /dashboard/recipes
import {
  RecipeDetailComponent,
  CookDialogComponent
} from './components/dashboard/recipes/recipe-detail/recipe-detail.component';

// -------------------------------------------------------------

@NgModule({
  declarations: [
    ExpirationPipe,
    AppComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    PagenotfoundComponent,
    RecipeArchiveComponent,
    RegisterComponent,
    GroceriesComponent,
    HistoryComponent,
    InventoryComponent,
    ConfirmationDialogComponent,
    OverviewComponent,
    RecipesComponent,
    SettingsComponent,
    ItemAddComponent,
    ItemDetailComponent,
    RecipeDetailComponent,
    CookDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent,
    CookDialogComponent,
  ]
})
export class AppModule { }
