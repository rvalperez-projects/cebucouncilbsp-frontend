import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Grid Columns
  breakpoint: number;

  constructor(
    private header: AppComponent) { }

  ngOnInit(): void {
    this.header.initLoggedInUser();
    this.breakpoint = (window.innerWidth <= 599) ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 599) ? 1 : 2;
  }

}
