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

// Shared
import { SharedModule } from './_modules/shared/shared.module';

// Components
import { NavigationComponent } from './_components/navigation/navigation.component';
import { GaugeCardComponent } from './_components/gauge-card/gauge-card.component';

// Layouts
import { AuthPageComponent } from './_layouts/auth-page/auth-page.component';
import { DashboardComponent } from './_layouts/dashboard/dashboard.component';
import { SettingsComponent } from './_layouts/settings/settings.component';

// Views
import { LoginComponent } from './_views/login/login.component';
import { SignupComponent } from './_views/signup/signup.component';
import { ActivityLogComponent } from './_views/activity-log/activity-log.component';
import { OverviewComponent } from './_views/overview/overview.component';
import { AccountComponent } from './_views/account/account.component';

// -------------------------------------------------------------

@NgModule({
  declarations: [
    AppComponent,
    GaugeCardComponent,
    NavigationComponent,
    AuthPageComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
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
