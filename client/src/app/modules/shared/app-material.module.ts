import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatStepperModule } from '@angular/material/stepper';

// -------------------------------------------------------------

const matModules = [
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
  MatStepperModule,
];

@NgModule({
  declarations: [],
  imports: [...matModules],
  exports: [...matModules],
})
export class AppMaterialModule {}
