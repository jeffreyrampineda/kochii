import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

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
    this.getHistory();
  }

  /** Get all history and set them for presentation. */
  getHistory(): void {
    this.historyService.getHistory().subscribe(
      history => {
        this.history = new MatTableDataSource(history);
        this.history.paginator = this.paginator;
      }
    );
  }

  /** Delete all history. */
  clear(): void {
    this.historyService.deleteAllHistory().subscribe(
      response => {
        console.log(response);
        if (response.n === this.history.data.length) {
          this.history.data = [];
        }
      }
    );
  }
}
