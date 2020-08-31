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

  landbankAccount: string;
  bpiAccount: string;
  gcashAccount: string;
  paymayaAccount: string;

  constructor(
    private header: AppComponent) { 
      this.landbankAccount = "xxxx-xxxx-xxxx";
      this.bpiAccount = "xxxx-xxxx-xxxx";
      this.gcashAccount = "xxxx-xxxx-xxxx";
      this.paymayaAccount = "xxxx-xxxx-xxxx";
  }

  ngOnInit(): void {
    this.header.initLoggedInUser();
    this.breakpoint = (window.innerWidth <= 599) ? 1 : 4;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 599) ? 1 : 4;
  }

}
