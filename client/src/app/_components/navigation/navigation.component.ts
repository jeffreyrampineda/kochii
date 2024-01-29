import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  domainUrl = environment.domain;

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.setTitle('Overview');
  }

  setTitle(title: string): void {
    this.titleService.setTitle(title + ' | Kochii');
  }
}
