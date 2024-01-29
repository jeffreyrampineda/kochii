import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';

// -------------------------------------------------------------

const matModules = [
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSortModule,
  MatIconModule,
  MatBadgeModule,
  MatStepperModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatTableModule,
  MatTooltipModule,
  MatSelectModule,
  MatTabsModule,
  MatSidenavModule,
];

@NgModule({
  declarations: [],
  imports: [...matModules],
  exports: [...matModules],
})
export class AppMaterialModule {}
