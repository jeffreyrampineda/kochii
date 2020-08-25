import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { LinearTickOptions } from 'chart.js';
import { HistoryService } from 'src/app/services/history.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { MatTableDataSource } from '@angular/material/table';

interface ChartData {
  x: any;
  y: any;
}

@Component({
  selector: 'kochii-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  @ViewChild("canvasLine") canvasLine: ElementRef;

  fromDay = 6;
  doughnutChart;
  lineChart;
  start: Date = new Date();
  today: Date = new Date();
  numberOfExpired = 0;
  rawHistoryData = [];
  itemTotal = 0;
  loadingInventory = false;
  loadingHistory = false;
  weeklySpent = 0;

  firstWeekDay: Date;
  lastWeekDay: Date;

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
    });
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

  initializeDoughnut(itemsCount: number, good: number, ok: number, expired: number): void {
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
      },
      plugins: [{
        beforeDraw: function (chart) {
          const width = chart.width,
            height = chart.height,
            ctx = chart.ctx;

          ctx.restore();
          ctx.font = `${(height / 110).toFixed(2)}em sans-serif`;
          ctx.textBaseline = 'alphabetic';

          const text = Math.round((good + ok) * 1.0 / itemsCount * 100).toString() + '%',
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }]
    });
  }

  initializeLineOne(): void {
    const gradientBlue = this.canvasLine.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradientBlue.addColorStop(0, 'rgba(50, 65, 160, 0.5)');
    gradientBlue.addColorStop(1, 'rgba(70, 200, 250, 0.1)');

    const data = {
      datasets: [{
        label: 'Total quantity',
        data: this.totalQuantityPerDay(
          this.rawHistoryData.filter(h => h.method === 'add'),
          this.rawHistoryData.filter(h => h.method === 'delete')
        ),
        borderColor: gradientBlue,
        borderWidth: 2,
        pointHoverRadius: 10,
        pointRadius: 5,
        backgroundColor: gradientBlue,
      }]
    };

    this.lineChart = new Chart('chart-line', {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            ticks: {
              min: this.start.toDateString(),
              max: this.today.toDateString(),
            },
            time: {
              unit: 'day',
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
   * @param data - raw history data.
   * @param data2 - raw history data.
   * @returns An array that can be used for chartjs.
   */
  totalQuantityPerDay(data: any[], data2: any[]): ChartData[] {
    const quantityPerDay = this.mergeSameDates(data);

    data2.forEach(i => {
      const dateString = (new Date(i.addedDate)).toDateString();

      if (quantityPerDay[dateString] !== undefined) {
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
      if (i !== 0) {
        totalQuantityPerDayData[i].y += totalQuantityPerDayData[i - 1].y;
      }
    }
    return totalQuantityPerDayData;
  }

  /**
   * Sums up the quantities of all histories with similar dates.
   * @param data - raw history data.
   * @returns An object of simplified histories.
   */
  mergeSameDates(data: any[]): any {
    const t = new Date();
    let thisWeek = {};
    thisWeek[this.today.toDateString()] = 0;

    for (let i = 0; i < this.fromDay; i++) {
      const dateString = (new Date(t.setDate(t.getDate() - 1))).toDateString();
      thisWeek[dateString] = 0;
    }
    data.forEach(d => {
      const dateString = (new Date(d.addedDate)).toDateString();

      if (thisWeek[dateString] !== undefined) {
        thisWeek[dateString] += Math.abs(d.quantity);
      }
    });
    return thisWeek;
  }

  /**
   * Converts an object into a chartData[] array.
   * @param data - object.
   * @returns An array that can be used for chartjs.
   */
  objectToChartData(data: {}): ChartData[] {
    return Object.keys(data).map(function (key) {
      return { 'x': new Date(key), 'y': data[key] };
    });
  }

  /**
   * Calculate the difference between the given date and today.
   * @param date - date object.
   * @returns A number of days different.
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
        this.weeklySpent = result.reduce((acc, curr) => acc += (curr.cost * curr.quantity), 0);
      }
    );
  }
}
