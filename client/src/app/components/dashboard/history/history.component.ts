import { Component, OnInit, ViewChild } from '@angular/core';
import { History } from 'src/app/interfaces/history';
import { HistoryService } from 'src/app/services/history.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {


  displayedColumns: string[] = ['#', 'recorded at', 'method', 'target', 'quantity', 'addedDate', 'description', ];
  histories: History[] = [];
  loading = false;

  constructor(
    private historyService: HistoryService
  ) { }

  // -------------------------------------------------------------

  ngOnInit() {
    this.getHistory();
  }

  /** Get all history and set them for presentation. */
  getHistory(): void {
    this.loading = true;
    this.historyService.getHistory().subscribe({
      next: response => {
        this.histories = response;
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

  /** Delete all history. */
  clear(): void {
    this.loading = true;
    this.historyService.deleteAllHistory().subscribe({
      next: response => {
        if (response === 1) {
          this.histories = [];
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

  /** Checks whether history is empty or not */
  isEmpty(): boolean {
    return this.histories.length === 0 ? true : false;
  }
}
