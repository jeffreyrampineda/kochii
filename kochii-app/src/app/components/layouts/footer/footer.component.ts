import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kochii-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() className: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
