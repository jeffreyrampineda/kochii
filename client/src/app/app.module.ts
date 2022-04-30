import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components - views
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

// Components - shared
import { SharedModule } from './modules/shared/shared.module';

// -------------------------------------------------------------

@NgModule({
  declarations: [
    CountdownPipe,
    ExpirationPipe,
    StatusPipe,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GroceriesComponent,
    ActivityLogComponent,
    InventoryComponent,
    OverviewComponent,
    SettingsComponent,
    ItemAddComponent,
    ItemUpdateComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
