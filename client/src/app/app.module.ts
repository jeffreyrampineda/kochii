import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Interceptors
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

// App-level
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components - views
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ActivityLogComponent } from './views/activity-log/activity-log.component';
import { OverviewComponent } from './views/overview/overview.component';
import { SettingsComponent } from './views/settings/settings.component';
import { AccountComponent } from './views/account/account.component';

// Components - shared
import { SharedModule } from './modules/shared/shared.module';

// -------------------------------------------------------------

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ActivityLogComponent,
    OverviewComponent,
    SettingsComponent,
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
