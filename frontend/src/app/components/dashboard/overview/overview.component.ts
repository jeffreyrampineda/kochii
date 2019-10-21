import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Item } from 'src/app/interfaces/item';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'kochii-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  doghnutChart;
  lineChart;
  inventory: Item[] = [];
  numberOfExpired = 0;

  constructor(
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.inventoryService.getInventory().subscribe({
      next: response => {
        this.inventory = response;
        this.numberOfExpired = (this.inventory.filter(i => this.expirationCountdown(i.expirationDate.toString()) < 0)).length;
        this.initializeDoughnut();
        this.initializeLineOne();
  
        // TODO - make general config/data/options generator to be used by all charts.
      },
      error: err => {
          // Error
      },
      complete: () => {
          // TODO - stop loading.
      }
    });
  }


  initializeDoughnut(): void {
    const data = {
      labels: ['Good', 'Ok', 'Bad'],
      datasets: [{
        data: [
          (this.inventory.filter(i => this.expirationCountdown(i.expirationDate.toString()) > 10)).length,
          (this.inventory.filter(i =>
            this.expirationCountdown(i.expirationDate.toString()) < 10 &&
            this.expirationCountdown(i.expirationDate.toString()) >= 0
          )).length,
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
      data: data
    });
  }

  initializeLineOne(): void {
    const data = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{
        label: '# of items',

        // TODO - fix this. find a way to get weekly relativity data then relative to that data
        // calculate the items added during that day + before that day.
        data: [
          this.inventory.length,
          this.inventory.length,
        ],
        fill: false,
      }]
    };

    const options = {
      responsive: true,
      title: {
        display: true,
        text: 'Inventory size'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Days'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Quantity'
          },
          ticks: {
            precision: 0
          },
        }]
      },
    };

    this.lineChart = new Chart('chart-line', {
      type: 'line',
      data: data,
      options: options,
    });
  }

  expirationCountdown(date: string): number {
    const expirationDate = new Date(date);
    const today = new Date();
    const timeDiff = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }
}
