import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

export interface FormListInfo {
  dateApplied: string;
  aurNumber: string;
  district: string;
  institution: string;
  status: string;
  lastUpdatedDate: string;
}

const ELEMENT_DATA: FormListInfo[] = [
  {dateApplied: '2020-08-08', aurNumber: '', district: 'North 1', institution: 'Tejero', status: 'H', lastUpdatedDate: '2020-08-08'},
  {dateApplied: '2020-08-08', aurNumber: '', district: 'North 2', institution: 'Hipodromo', status: 'H', lastUpdatedDate: '2020-08-08'},
  {dateApplied: '2020-08-08', aurNumber: '029182', district: 'North 3', institution: 'School 3', status: 'H', lastUpdatedDate: '2020-08-08'},
  {dateApplied: '2020-08-08', aurNumber: '892131', district: 'North 4', institution: 'School 4', status: 'H', lastUpdatedDate: '2020-08-08'}
];

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormsListComponent implements OnInit {

  // Declare combo box data
  Districts: any = ['North 1', 'North 2'];
  Areas: any = ['I', 'II', 'III'];
  Institutions: any = ['Tejero', 'Carreta', 'Central'];

  // Set destination value
  selectedDistrict: string;
  selectedArea: string;
  selectedInstitution: string;

  // Set table data
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['dateApplied', 'aurNumber', 'district', 'institution', 'status', 'lastUpdatedDate'];


  constructor(
    public  route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // this.name = params['name'];
    }); 
  }

}
