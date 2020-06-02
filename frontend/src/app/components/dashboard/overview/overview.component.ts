import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Item } from 'src/app/interfaces/item';
import { InventoryService } from 'src/app/services/inventory.service';

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
  inventory: Item[] = [];
  start: Date = new Date();
  today: Date = new Date();
  numberOfGood: number = 0;
  numberOfOk: number = 0;
  numberOfExpired: number = 0;

  constructor(
    private inventoryService: InventoryService
  ) {
    this.start.setDate(this.start.getDate() - 6);
    this.start.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.inventoryService.getItems().subscribe({
      next: response => {
        this.inventory = response;
        this.initializeDoughnut();
        this.initializeLineOne();
        // TODO - make general config/data/options generator to be used by all charts.
      },
      error: err => {
        // Error
      },
      complete: () => {
        // TODO - stop loading.
        this.numberOfGood = (this.inventory.filter(i => this.expirationCountdown(i.expirationDate) > 10)).length;
        this.numberOfOk = (this.inventory.filter(i =>
          this.expirationCountdown(i.expirationDate.toString()) < 10 &&
          this.expirationCountdown(i.expirationDate.toString()) >= 0
        )).length;
        this.numberOfExpired = (this.inventory.filter(i => this.expirationCountdown(i.expirationDate) < 0)).length;
      }
    });
  }

  initializeDoughnut(): void {
    const data = {
      labels: ['Good', 'Ok', 'Bad'],
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
    const sampleRemovedQuantityPerDay = [
      { 'x': "Mon Jun 01 2020", 'y': -2 }
    ]

    const data = {
      datasets: [{
        label: 'Added',
        data: this.addedQuantityPerDay(),
        backgroundColor: 'rgba(0, 255, 0, 0.3)'
      }, {
        label: 'Removed',
        data: sampleRemovedQuantityPerDay,
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

  addedQuantityPerDay(): chartData[] {
    const addedQuantityPerDay = this.inventory.reduce((acc, curr) => {
      if (acc[curr.addedDate] != undefined) {
        acc[curr.addedDate] += curr.quantity;
      } else {
        acc[curr.addedDate] = curr.quantity;
      }
      return acc;
    }, {});

    return Object.keys(addedQuantityPerDay).map(function (key) {
      return { 'x': new Date(key).toDateString(), 'y': addedQuantityPerDay[key] };
    })
  }

  expirationCountdown(date: string): number {
    const expirationDate = new Date(date);
    const timeDiff = expirationDate.getTime() - this.today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }
}
