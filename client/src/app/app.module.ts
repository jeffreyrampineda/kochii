import { BrowserModule, Title } from '@angular/platform-browser';
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

// Components - layouts
import { FooterComponent } from './components/layouts/footer/footer.component';
import { NavigationComponent } from './components/layouts/navigation/navigation.component';

// Components - views
import { DashboardComponent } from './components/views/dashboard/dashboard.component';
import { LoginComponent } from './components/views/login/login.component';
import { RegisterComponent } from './components/views/register/register.component';
import { GroceriesComponent } from './components/views/groceries/groceries.component';
import { HistoryComponent } from './components/views/history/history.component';
import { InventoryComponent } from './components/views/inventory/inventory.component';
import { OverviewComponent } from './components/views/overview/overview.component';
import { SettingsComponent } from './components/views/settings/settings.component';
import { ItemAddComponent } from './components/views/item-add/item-add.component';
import { ItemUpdateComponent } from './components/views/item-update/item-update.component';

// Components - shared
import { UpdateDialogComponent } from './components/shared/update-dialog/update-dialog.component';
import { CreateGroupDialogComponent } from './components/shared/create-group-dialog/create-group-dialog.component';
import { PresentationContainerComponent } from './components/shared/presentation-container/presentation-container.component';
import { GaugeCardComponent } from './components/shared/gauge-card/gauge-card.component';
import { ItemEditComponent } from './components/shared/item-edit/item-edit.component';

// -------------------------------------------------------------

@NgModule({
  declarations: [
    CountdownPipe,
    ExpirationPipe,
    StatusPipe,
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    GroceriesComponent,
    HistoryComponent,
    InventoryComponent,
    OverviewComponent,
    SettingsComponent,
    ItemAddComponent,
    UpdateDialogComponent,
    CreateGroupDialogComponent,
    FooterComponent,
    NavigationComponent,
    PresentationContainerComponent,
    GaugeCardComponent,
    ItemEditComponent,
    ItemUpdateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppMaterialModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
