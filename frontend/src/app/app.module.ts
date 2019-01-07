import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatMenuModule,
  MatCardModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatTableModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatToolbarModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatAutocompleteModule
} from '@angular/material';

import { HttpClientModule }    from '@angular/common/http';
/*
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
*/

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeArchiveComponent } from './components/recipe-archive/recipe-archive.component';
import { RegisterComponent } from './components/register/register.component';
import { OverviewComponent } from './components/dashboard/overview/overview.component';
import { InventoryComponent } from './components/dashboard/inventory/inventory.component';
import { ItemComponent } from './components/dashboard/inventory/item.component';
import { AddItemComponent } from './components/dashboard/inventory/add-item.component';

import { RecipesComponent } from './components/dashboard/recipes/recipes.component';

import { GroceriesComponent } from './components/dashboard/groceries/groceries.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';
import { HistoryComponent } from './components/dashboard/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    RecipeArchiveComponent,
    RegisterComponent,
    OverviewComponent,
    InventoryComponent,
    ItemComponent,
    AddItemComponent,
    RecipesComponent,
    GroceriesComponent,
    SettingsComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
/*
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
*/
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTableModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
