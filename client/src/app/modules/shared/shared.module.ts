import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from './app-material.module';

// Components - Layouts
import { FooterComponent } from './layouts/footer/footer.component';
import { NavigationComponent } from './layouts/navigation/navigation.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';

// Components - Reusables
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { LinkGroupComponent } from './components/link-group/link-group.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { GaugeCardComponent } from './components/gauge-card/gauge-card.component';
import { PresentationContainerComponent } from './components/presentation-container/presentation-container.component';

const sharedComponents = [
  FooterComponent,
  NavigationComponent,
  DashboardComponent,
  AuthPageComponent,
  LinkGroupComponent,
  ErrorMessagesComponent,
  GaugeCardComponent,
  PresentationContainerComponent,
];

@NgModule({
  declarations: [...sharedComponents],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    ...sharedComponents,
  ],
})
export class SharedModule {}
