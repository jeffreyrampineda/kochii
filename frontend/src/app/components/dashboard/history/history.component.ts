import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { History } from 'src/app/interfaces/history';
import { HistoryService } from 'src/app/services/history.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['date', 'method', 'description', 'target'];
  history: MatTableDataSource<History>;

  constructor(
    private historyService: HistoryService
  ) { }

  // -------------------------------------------------------------

  ngOnInit() {
    // Set up inventory: MatTableDataSource with empty inital data
    this.history = new MatTableDataSource();
    this.history.paginator = this.paginator;

    this.getHistory();
  }

  /** Get all history and set them for presentation. */
  getHistory(): void {
    this.historyService.getHistory().subscribe({
      next: response => {
        this.history.data = response;
      },
      error: err => {
        // Error
      },
      complete: () => {
        // TODO - stop loading.
      }
    });
  }

  /** Delete all history. */
  clear(): void {
    this.historyService.deleteAllHistory().subscribe({
      next: response => {
        if (response === 1) {
          this.history.data = [];
        }
      },
      error: err => {
        // Error
      },
      complete: () => {
        // TODO - stop loading.
      }
    });
  }
}
