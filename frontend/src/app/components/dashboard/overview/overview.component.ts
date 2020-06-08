import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { HistoryService } from 'src/app/services/history.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { MatTableDataSource } from '@angular/material/table';

interface chartData {
  x: any,
  y: any
}

@Component({
  selector: 'kochii-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  fromDay = 6;
  doughnutChart;
  lineChart;
  start: Date = new Date();
  today: Date = new Date();
  numberOfGood: number = 0;
  numberOfOk: number = 0;
  numberOfExpired: number = 0;
  rawHistoryData = [];
  itemTotal = 0;

  displayedColumns: string[] = ['method', 'target', 'quantity', 'addedDate', 'description'];
  history: MatTableDataSource<History>;

  constructor(
    private historyService: HistoryService,
    private inventoryService: InventoryService
  ) {
    this.start.setDate(this.start.getDate() - 6);
    this.start.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.history = new MatTableDataSource();

    this.getHistoryData();
    this.getInventory();
  }

  getInventory(): void {
    this.inventoryService.getItems().subscribe({
      next: response => {
        this.numberOfGood = (response.filter(i => this.sinceToday(i.expirationDate) > 10)).length;
        this.numberOfOk = (response.filter(i =>
          this.sinceToday(i.expirationDate) < 10 &&
          this.sinceToday(i.expirationDate) >= 0
        )).length;
        this.numberOfExpired = (response.filter(i => this.sinceToday(i.expirationDate) < 0)).length;
        this.itemTotal = this.numberOfGood + this.numberOfOk + this.numberOfExpired;
      },
      error: err => {
        // Error
      },
      complete: () => {
        this.initializeDoughnut();
      }
    })
  }

  getHistoryData(): void {
    this.historyService.getAllFromPastDays(this.fromDay).subscribe({
      next: response => {
        this.history.data = response.slice(0, 4);
        this.rawHistoryData = response;
      },
      error: err => {
        // Error
      },
      complete: () => {
        this.initializeLineOne();
      }
    });
  }

  initializeDoughnut(): void {
    const data = {
      labels: ['Good', 'Ok', 'Expired'],
      datasets: [{
        data: [
          this.numberOfGood,
          this.numberOfOk,
          this.numberOfExpired,
        ],
        backgroundColor: [
          'rgba(45, 185, 140, 0.7)',
          'rgba(90, 155, 255, 0.7)',
          'rgba(255, 95, 130, 0.7)'
        ],
      }],
    };

    this.doughnutChart = new Chart('chart-doughnut', {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Expired items'
        },
        legend: {
          position: 'bottom'
        },
        maintainAspectRatio : false
      }
    });
  }

  initializeLineOne(): void {
    const data = {
      datasets: [{
        type: 'line',
        label: 'Total quantity',
        data: this.totalQuantityPerDay(this.rawHistoryData.filter(h => h.method === 'add'), this.rawHistoryData.filter(h => h.method === 'delete')),
        borderColor: 'rgba(0, 0, 255, 0.3)',
        borderWidth: 2,
        fill: false
      }, {
        type: 'bar',
        label: 'Added',
        data: this.parseRawData(this.rawHistoryData.filter(h => h.method === 'add')),
        backgroundColor: 'rgba(90, 155, 255, 0.7)',
        borderWidth: 2,
      }, {
        type: 'bar',
        label: 'Removed',
        data: this.parseRawData(this.rawHistoryData.filter(h => h.method === 'delete')),
        backgroundColor: 'rgba(255, 95, 130, 0.7)',
        borderWidth: 2,
      }]
    };

    this.lineChart = new Chart('chart-line', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Inventory size'
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {
              min: this.start,
              max: this.today,
              unit: "day",
              unitStepSize: 1,
              displayFormats: {
                'day': 'dd'
              }
            },
            stacked: true
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Quantity'
            },
            ticks: {
              precision: 0,
              beginAtZero: true
            }
          }]
        },
      },
    });
  }

  /**
   * Combines the 'add' and 'delete' rawHistoryData to form the total quantity per day.
   * @param { data } - raw history data 
   * @param { data2 } - raw history data
   * @returns { chartData[] } - array that can be used for chartjs. 
   */
  totalQuantityPerDay(data: any[], data2: any[]): chartData[] {
    const quantityPerDay = this.mergeSameDates(data);

    data2.forEach(i => {
      const dateString = (new Date(i.addedDate)).toDateString();

      if (quantityPerDay[dateString] != undefined) {
        quantityPerDay[dateString] += i.quantity;
      } else {
        quantityPerDay[dateString] = 0;
      }
    });

    const totalQuantityPerDayData = this.objectToChartData(quantityPerDay);

    totalQuantityPerDayData.sort(function(a,b){
      return (+new Date(a.x)) - (+new Date(b.x));
    });

    for (let i = 0; i < totalQuantityPerDayData.length; i++) {
      if (i != 0) {
        totalQuantityPerDayData[i].y += totalQuantityPerDayData[i - 1].y;
      }
    }
    return totalQuantityPerDayData;
  }

  /**
   * Sums up the quantities of all histories with similar dates.
   * @param { data } - raw history data
   * @returns { object } - object of simplified histories.
   */
  mergeSameDates(data: any[]) {
    return data.reduce((acc, curr) => {
      const dateString = (new Date(curr.addedDate)).toDateString();

      if (acc[dateString] != undefined) {
        acc[dateString] += curr.quantity;
      } else {
        acc[dateString] = curr.quantity;
      }
      return acc;
    }, {});
  }

  /**
   * Converts an object into a chartData[] array.
   * @param { data } - object
   * @returns { chartData[] } - array that can be used for chartjs.
   */
  objectToChartData(data: {}): chartData[] {
    return Object.keys(data).map(function (key) {
      return { 'x': new Date(key), 'y': data[key] };
    });
  } 

  /**
   * Parses raw history data to be used for chartjs.
   * @param { data } - raw history data
   * @returns { chartData[] } - array that can be used for chartjs.
   */
  parseRawData(data: any[]): chartData[] {
    const quantityPerDay = this.mergeSameDates(data);
    return this.objectToChartData(quantityPerDay);
  }

  /**
   * Calculate the difference between the given date and today.
   * @param { date } - date object
   * @returns { number } - number of days different.
   */
  sinceToday(date: Date): number {
    const expirationDate = new Date(date);
    const timeDiff = expirationDate.getTime() - this.today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays === -0 ? 0 : diffDays;
  }
}
