import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from './app-material.module';

// Components
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { LinkGroupComponent } from './components/link-group/link-group.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { PresentationContainerComponent } from './components/presentation-container/presentation-container.component';
import { UpdateDialogComponent } from '../shared/components/update-dialog/update-dialog.component';

// Layouts
import { FooterComponent } from './layouts/footer/footer.component';


const sharedComponents = [
  FooterComponent,
  AuthPageComponent,
  LinkGroupComponent,
  ErrorMessagesComponent,
  PresentationContainerComponent,
  UpdateDialogComponent,
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
