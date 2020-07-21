import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// MDB
import {
  ButtonsModule,
  WavesModule,
  CardsModule,
  IconsModule,
  NavbarModule,
  InputsModule,
  InputUtilitiesModule,
  TableModule,
} from 'angular-bootstrap-md'

// -------------------------------------------------------------

const matModules = [
  CommonModule,
  MatButtonModule,
  MatPaginatorModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatSortModule,
  MatSnackBarModule,
  MatSelectModule,

  // MDB
  ButtonsModule,
  WavesModule,
  CardsModule,
  IconsModule,
  NavbarModule,
  InputsModule,
  InputUtilitiesModule,
  TableModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...matModules,
  ],
  exports: [
    ...matModules,
  ]
})
export class AppMaterialModule { }
