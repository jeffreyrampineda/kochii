import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { HistoryService } from 'src/app/services/history.service';

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

  doghnutChart;
  lineChart;
  start: Date = new Date();
  today: Date = new Date();
  numberOfGood: number = 0;
  numberOfOk: number = 0;
  numberOfExpired: number = 0;
  rawData = {
    items: [],
    history: []
  };

  constructor(
    private historyService: HistoryService
  ) {
    this.start.setDate(this.start.getDate() - 6);
    this.start.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.historyService.getAllFromPastDays(6).subscribe({
      next: response => {
        this.rawData = response;
        this.numberOfGood = (this.rawData.items.filter(i => this.expirationCountdown(i.expirationDate) > 10)).length;
        this.numberOfOk = (this.rawData.items.filter(i =>
          this.expirationCountdown(i.expirationDate) < 10 &&
          this.expirationCountdown(i.expirationDate) >= 0
        )).length;
        this.numberOfExpired = (this.rawData.items.filter(i => this.expirationCountdown(i.expirationDate) < 0)).length;

        // TODO - make general config/data/options generator to be used by all charts.
      },
      error: err => {
        // Error
      },
      complete: () => {
        this.initializeDoughnut();
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
          'rgba(0, 255, 0, 0.3)',
          'rgba(255, 255, 0, 0.3)',
          'rgba(255, 0, 0, 0.3)',
        ],
      }],
    };

    this.doghnutChart = new Chart('chart-doughnut', {
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
        }
      }
    });
  }

  initializeLineOne(): void {
    const data = {
      datasets: [{
        label: 'Added',
        data: this.parseRawData(this.rawData.items),
        backgroundColor: 'rgba(0, 255, 0, 0.3)'
      }, {
        label: 'Removed',
        data: this.parseRawData(this.rawData.history),
        backgroundColor: 'rgba(255, 0, 0, 0.3)'
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

  parseRawData(data: any[]): chartData[] {
    const quantityPerDay = data.reduce((acc, curr) => {
      const dateString = (new Date(curr.addedDate)).toDateString();

      if (acc[dateString] != undefined) {
        acc[dateString] += curr.quantity;
      } else {
        acc[dateString] = curr.quantity;
      }
      return acc;

    }, {});

    return Object.keys(quantityPerDay).map(function (key) {
      return { 'x': new Date(key), 'y': quantityPerDay[key] };
    });
  } 

  expirationCountdown(date: Date): number {
    const expirationDate = new Date(date);
    const timeDiff = expirationDate.getTime() - this.today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays === -0 ? 0 : diffDays;
  }
}
