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

  landbankAccountName: string;
  landbankAccountNumber: string;
  remittanceAccountName: string;
  remittanceAccountNumber: string;

  constructor(
    private header: AppComponent) { 
      this.landbankAccountName = "Cebu Council Boy Scouts of the Philippines";
      this.landbankAccountNumber = "0141-4821-14";
      this.remittanceAccountName = "Rachel Ann Lapiña";
      this.remittanceAccountNumber = "0927-216-7560";
  }

  ngOnInit(): void {
    this.header.initLoggedInUser();
    this.breakpoint = (window.innerWidth <= 599) ? 1 : 4;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 599) ? 1 : 4;
  }

}
