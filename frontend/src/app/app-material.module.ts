import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  MatAutocompleteModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatSortModule
} from '@angular/material';

// -------------------------------------------------------------

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
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
    MatAutocompleteModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSortModule
  ],
  exports: [
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
    MatAutocompleteModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSortModule
  ]
})
export class AppMaterialModule { }
