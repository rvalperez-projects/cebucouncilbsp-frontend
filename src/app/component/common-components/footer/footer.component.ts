import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  // Grid Columns
  breakpoint: number;

  constructor() { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 599) ? 1 : 3;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 599) ? 1 : 3;
  }

}
