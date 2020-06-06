import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Interceptors
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

// Pipes
import { CountdownPipe } from './pipes/countdown.pipes';
import { ExpirationPipe } from './pipes/expiration.pipes';
import { StatusPipe } from './pipes/status.pipes';

// App-level
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { RegisterComponent } from './components/register/register.component';

// Components - /dashboard
import { GroceriesComponent } from './components/dashboard/groceries/groceries.component';
import { HistoryComponent } from './components/dashboard/history/history.component';
import { InventoryComponent } from './components/dashboard/inventory/inventory.component';
import { OverviewComponent } from './components/dashboard/overview/overview.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';

// Components - /dashboard/inventory
import { ItemAddComponent } from './components/dashboard/inventory/item-add/item-add.component';

// Components - dialogs
import { UpdateDialogComponent } from './components/dialogs/update-dialog/update-dialog.component';
import { CreateGroupDialogComponent } from './components/dialogs/create-group-dialog/create-group-dialog.component';

// -------------------------------------------------------------

@NgModule({
  declarations: [
    CountdownPipe,
    ExpirationPipe,
    StatusPipe,
    AppComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    PagenotfoundComponent,
    RegisterComponent,
    GroceriesComponent,
    HistoryComponent,
    InventoryComponent,
    OverviewComponent,
    SettingsComponent,
    ItemAddComponent,
    UpdateDialogComponent,
    CreateGroupDialogComponent,
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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UpdateDialogComponent,
    CreateGroupDialogComponent,
  ]
})
export class AppModule { }
