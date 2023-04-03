import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/interfaces/activity';
import { InventoryService } from 'src/app/services/inventory.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

interface ChartData {
  x: Date;
  y: number;
}

interface Week {
  [index: string]: number;
}

@Component({
  selector: 'kochii-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  @ViewChild('canvasLine') canvasLine: ElementRef;

  fromDay = 7;
  doughnutChart;
  lineChart;
  today: Date = new Date();
  numberOfExpired = 0;
  rawActivitiesData: Activity[] = [];
  itemTotal = 0;
  loadingInventory = false;
  loadingActivities = false;
  weeklySpent = 0;

  firstWeekDay: Date;
  lastWeekDay: Date;

  displayedColumns: string[] = [
    'method',
    'target',
    'quantity',
    'addedDate',
    'description',
  ];
  activities: MatTableDataSource<Activity>;

  constructor(
    private activityService: ActivityService,
    private inventoryService: InventoryService
  ) {
    Chart.register(...registerables);

    this.today.setHours(0, 0, 0, 0);
    this.firstWeekDay = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - this.today.getDay()
    );

    this.lastWeekDay = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.firstWeekDay.getDate() + 6
    );
  }

  ngOnInit() {
    this.activities = new MatTableDataSource();

    this.getActivitiesData();
    this.getInventory();

    this.getItemsAddedThisWeek();
  }

  getInventory(): void {
    this.loadingInventory = true;
    this.inventoryService.getItems().subscribe({
      next: (response) => {
        const numberOfGood = response.filter(
          (i) => this.sinceToday(i.expirationDate) > 10
        ).length;
        const numberOfOk = response.filter(
          (i) =>
            this.sinceToday(i.expirationDate) < 10 &&
            this.sinceToday(i.expirationDate) >= 0
        ).length;
        this.numberOfExpired = response.filter(
          (i) => this.sinceToday(i.expirationDate) < 0
        ).length;
        this.itemTotal = numberOfGood + numberOfOk + this.numberOfExpired;
        this.initializeDoughnut(
          this.itemTotal,
          numberOfGood,
          numberOfOk,
          this.numberOfExpired
        );
      },
      error: (err) => {
        // Error
        this.loadingInventory = false;
      },
      complete: () => {
        this.loadingInventory = false;
      },
    });
  }

  getActivitiesData(): void {
    this.loadingActivities = true;
    this.activityService.getAllFromPastDays(this.fromDay).subscribe({
      next: (response) => {
        this.activities.data = response.slice(0, 4);
        this.rawActivitiesData = response;
      },
      error: (err) => {
        // Error
        this.loadingActivities = false;
      },
      complete: () => {
        this.loadingActivities = false;
        this.initializeLineOne();
      },
    });
  }

  initializeDoughnut(
    itemsCount: number,
    good: number,
    ok: number,
    expired: number
  ): void {
    const data = {
      labels: ['', 'Good', 'Ok', 'Expired'],
      datasets: [
        {
          data: [itemsCount === 0 ? 1 : 0, good, ok, expired],
          backgroundColor: [
            'rgba(170, 175, 190, 0.7)',
            'rgba(45, 185, 140, 0.7)',
            'rgba(139, 184, 255)',
            'rgba(255, 142, 167)',
          ],
        },
      ],
    };

    this.doughnutChart = new Chart('chart-doughnut', {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              filter: (item) => item.text !== '',
            },
          },
        },
        cutout: 75,
        animation: {
          duration: 0,
        },
        maintainAspectRatio: false,
      },
      plugins: [
        {
          id: 'centerText',
          beforeDraw: function (chart) {
            const {
              ctx,
              chartArea: { width, height },
            } = chart;
            ctx.save();

            const label =
              itemsCount > 0
                ? Math.round((((good + ok) * 1.0) / itemsCount) * 100) + '%'
                : 'No Data';

            ctx.font = '1.75em sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, width / 2, height / 2);
          },
        },
      ],
    });
  }

  initializeLineOne(): void {
    const gradientBlue = this.canvasLine.nativeElement
      .getContext('2d')
      .createLinearGradient(0, 0, 0, 400);
    gradientBlue.addColorStop(0, 'rgba(50, 65, 160, 0.5)');
    gradientBlue.addColorStop(1, 'rgba(70, 200, 250, 0.1)');

    const data = {
      datasets: [
        {
          label: 'Total quantity',
          data: this.totalQuantityPerDay(),
          borderColor: 'rgba(28, 35, 49, 0.5)',
          borderWidth: 2,
          pointHoverRadius: 10,
          pointRadius: 5,
          backgroundColor: gradientBlue,
          fill: true,
        },
      ],
    };

    const start = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 6
    );

    this.lineChart = new Chart('chart-line', {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              stepSize: 1,
              tooltipFormat: 'MMMM dd',
              displayFormats: {
                day: 'MMM dd',
              },
            },
            stacked: true,
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Quantity',
            },
            ticks: {
              precision: 0,
            },
            beginAtZero: true,
          },
        },
        animation: {
          duration: 0,
        },
        maintainAspectRatio: false,
      },
    });
  }

  /**
   * Combines the 'add' and 'delete' rawActivitiesData to form the total quantity per day.
   * @param dataAdd - data with adding quantities.
   * @param dataDelete - data with removing quantities.
   * @returns An array that can be used for chartjs.
   */
  totalQuantityPerDay(): ChartData[] {
    const dataAdd = this.rawActivitiesData.filter((h) => h.method === 'add');
    const dataDelete = this.rawActivitiesData.filter(
      (h) => h.method === 'delete'
    );

    const quantityPerDay = this.createEmptyWeek();

    dataAdd.forEach((i) => {
      quantityPerDay[i.addedDate.toDateString()] += i.quantity;
    });

    dataDelete.forEach((i) => {
      quantityPerDay[i.addedDate.toDateString()] += i.quantity;
    });

    const totalQuantityPerDayData = this.weekToChartData(quantityPerDay);

    totalQuantityPerDayData.sort(function (a, b) {
      return +a.x - +b.x;
    });

    // Increment from previous day.
    for (let i = 1; i < totalQuantityPerDayData.length; i++) {
      totalQuantityPerDayData[i].y += totalQuantityPerDayData[i - 1].y;
    }
    return totalQuantityPerDayData;
  }

  /**
   * Creates an empty indexable object of the entire week with datestring
   * as key, quantity as value.
   * @returns An object of the entire week with empty values.
   */
  createEmptyWeek(): Week {
    const t = new Date();
    const thisWeek: Week = {};
    thisWeek[t.toDateString()] = 0;

    for (let i = 0; i < this.fromDay; i++) {
      thisWeek[new Date(t.setDate(t.getDate() - 1)).toDateString()] = 0;
    }
    return thisWeek;
  }

  /**
   * Converts a week object into a chartData[] array.
   * @param data - week object.
   * @returns An array that can be used for chartjs.
   */
  weekToChartData(week: Week): ChartData[] {
    const data: ChartData[] = [];
    for (const day in week) {
      if (week.hasOwnProperty(day)) {
        data.push({ x: new Date(day), y: week[day] });
      }
    }
    return data;
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
    return this.rawActivitiesData.reduce((acc, curr) => {
      if (
        curr.addedDate >= this.firstWeekDay &&
        curr.addedDate <= this.lastWeekDay &&
        curr.quantity < 0
      ) {
        acc -= curr.quantity;
      }
      return acc;
    }, 0);
  }

  getItemsAddedThisWeek() {
    this.inventoryService
      .getItemsAddedBetween(this.firstWeekDay, this.lastWeekDay)
      .subscribe((result) => {
        this.weeklySpent = result.reduce(
          (acc, curr) => (acc += curr.cost * curr.quantity),
          0
        );
      });
  }
}
