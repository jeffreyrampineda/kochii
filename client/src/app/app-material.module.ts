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
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu'; 

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
  MatIconModule,
  MatTabsModule,
  MatBadgeModule,
  MatMenuModule,
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
