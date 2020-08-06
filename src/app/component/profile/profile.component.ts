import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedDistrict: string;
  selectedArea: string;
  selectedCategory: string;
  
  Categories: any = ['Primary', 'Secondary'];
  Districts: any = ['North 1', 'North 2'];
  Areas: any = ['I', 'II', 'III'];

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  
  constructor() { }

  ngOnInit(): void {
  }

}
