import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { LinearTickOptions } from 'chart.js';
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
  numberOfExpired: number = 0;
  rawHistoryData = [];
  itemTotal = 0;
  loadingInventory = false;
  loadingHistory = false;
  weeklySpent = 0;

  firstWeekDay;
  lastWeekDay;

  displayedColumns: string[] = ['method', 'target', 'quantity', 'addedDate', 'description'];
  history: MatTableDataSource<History>;

  constructor(
    private historyService: HistoryService,
    private inventoryService: InventoryService
  ) {
    const curr = new Date();
    curr.setHours(0, 0, 0, 0);
    const first = curr.getDate() - curr.getDay();

    this.start.setDate(this.start.getDate() - 6);
    this.start.setHours(0, 0, 0, 0);
    this.firstWeekDay = new Date(curr.setDate(first));
    this.lastWeekDay = new Date(curr.setDate(curr.getDate() + 6));
  }

  ngOnInit() {
    this.history = new MatTableDataSource();

    this.getHistoryData();
    this.getInventory();

    this.getItemsAddedThisWeek();
  }

  getInventory(): void {
    this.loadingInventory = true;
    this.inventoryService.getItems().subscribe({
      next: response => {
        const numberOfGood = (response.filter(i => this.sinceToday(i.expirationDate) > 10)).length;
        const numberOfOk = (response.filter(i =>
          this.sinceToday(i.expirationDate) < 10 &&
          this.sinceToday(i.expirationDate) >= 0
        )).length;
        this.numberOfExpired = (response.filter(i => this.sinceToday(i.expirationDate) < 0)).length;
        this.itemTotal = numberOfGood + numberOfOk + this.numberOfExpired;
        this.initializeDoughnut(this.itemTotal, numberOfGood, numberOfOk, this.numberOfExpired);
      },
      error: err => {
        // Error
        this.loadingInventory = false;
      },
      complete: () => {
        this.loadingInventory = false;
      }
    })
  }

  getHistoryData(): void {
    this.loadingHistory = true;
    this.historyService.getAllFromPastDays(this.fromDay).subscribe({
      next: response => {
        this.history.data = response.slice(0, 4);
        this.rawHistoryData = response;
      },
      error: err => {
        // Error
        this.loadingHistory = false;
      },
      complete: () => {
        this.loadingHistory = false;
        this.initializeLineOne();
      }
    });
  }

  initializeDoughnut(itemsCount, good, ok, expired): void {
    const data = {
      labels: ['', 'Good', 'Ok', 'Expired'],
      datasets: [{
        data: [
          itemsCount === 0 ? 1 : 0,
          good,
          ok,
          expired,
        ],
        backgroundColor: [
          'rgba(170, 175, 190, 0.7)',
          'rgba(45, 185, 140, 0.7)',
          'rgba(139, 184, 255)',
          'rgba(255, 142, 167)'
        ],
      }],
    };

    this.doughnutChart = new Chart('chart-doughnut', {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            filter: (item) => item.text !== '',
          }
        },
        cutoutPercentage: 75,
        tooltips: {
          filter: (item, chart) => chart.labels[item.index] !== ''
        },
        animation: {
          duration: 0
        },
        responsiveAnimationDuration: 0,
        maintainAspectRatio: false,
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
        label: 'Removed',
        data: this.parseRawData(this.rawHistoryData.filter(h => h.method === 'delete')),
        backgroundColor: 'rgba(255, 142, 167)',
      }, {
        type: 'bar',
        label: 'Added',
        data: this.parseRawData(this.rawHistoryData.filter(h => h.method === 'add')),
        backgroundColor: 'rgba(139, 184, 255)',
      }]
    };

    this.lineChart = new Chart('chart-line', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: false
        },
        scales: {
          xAxes: [{
            type: "time",
            ticks: {
              min: this.start.toDateString(),
              max: this.today.toDateString(),
            },
            time: {
              unit: "day",
              unitStepSize: 1,
              displayFormats: {
                'day': 'dd'
              }
            },
            stacked: true,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Quantity'
            },
            ticks: {
              precision: 0,
              beginAtZero: true
            } as LinearTickOptions
          }]
        },
        animation: {
          duration: 0
        },
        responsiveAnimationDuration: 0,
        maintainAspectRatio: false,
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
        quantityPerDay[dateString] = i.quantity;
      }
    });

    const totalQuantityPerDayData = this.objectToChartData(quantityPerDay);

    totalQuantityPerDayData.sort(function (a, b) {
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
        acc[dateString] += Math.abs(curr.quantity);
      } else {
        acc[dateString] = Math.abs(curr.quantity);
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

  quantityRemovedThisWeek(): number {
    let totalRemoved = 0;

    this.rawHistoryData.forEach(h => {
      if ((new Date(h.addedDate)) >= this.firstWeekDay && (new Date(h.addedDate)) <= this.lastWeekDay) {
        if (h.quantity < 0) {
          totalRemoved += h.quantity;
        }
      }
    });
    return Math.abs(totalRemoved);
  }

  getItemsAddedThisWeek() {
    this.inventoryService.getItemsAddedBetween(this.firstWeekDay, this.lastWeekDay).subscribe(
      result => {
        this.weeklySpent = result.reduce((acc, curr) => acc += (curr.cost * curr.quantity ), 0);
      }
    );
  }
}
