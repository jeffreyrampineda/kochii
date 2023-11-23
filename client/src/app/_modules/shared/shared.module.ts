import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from './app-material.module';

// Components
import { LinkGroupComponent } from './_components/link-group/link-group.component';
import { ErrorMessagesComponent } from './_components/error-messages/error-messages.component';
import { FooterComponent } from './_components/footer/footer.component';
import { UpdateDialogComponent } from './_components/update-dialog/update-dialog.component';

// Layouts
import { PresentationContainerComponent } from './_layouts/presentation-container/presentation-container.component';

const sharedComponents = [
  FooterComponent,
  ErrorMessagesComponent,
  LinkGroupComponent,
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
