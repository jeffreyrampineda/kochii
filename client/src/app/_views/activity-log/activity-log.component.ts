import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { Activity } from 'src/app/interfaces/activity';
import { ActivityService } from 'src/app/services/activity.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['date', 'method', 'target', 'quantity', 'addedDate', 'description', ];
  activities: MatTableDataSource<Activity>;
  loading = false;

  constructor(
    private activityService: ActivityService
  ) { }

  // -------------------------------------------------------------

  ngOnInit() {
    // Set up inventory: MatTableDataSource with empty inital data
    this.activities = new MatTableDataSource();
    this.activities.paginator = this.paginator;

    this.getActivities();
  }

  /** Get all activities and set them for presentation. */
  getActivities(): void {
    this.loading = true;
    this.activityService.getActivities().subscribe({
      next: response => {
        this.activities.data = response;
      },
      error: err => {
        // Error
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /** Delete all activities. */
  clear(): void {
    this.loading = true;
    this.activityService.clearActivities().subscribe({
      next: response => {
        if (response === 1) {
          this.activities.data = [];
        }
      },
      error: err => {
        // Error
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
