import { Component, OnInit } from '@angular/core';
import { ProfileValidator } from '../../validator/ProfileValidator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedDistrict: string;
  selectedArea: string;
  selectedCategory: string;
  passwordHide = true;
  confirmPasswordHide = true;
  profileValidator: ProfileValidator;
  
  Categories: any = ['Primary', 'Secondary'];
  Districts: any = ['North 1', 'North 2'];
  Areas: any = ['I', 'II', 'III'];

  
  constructor() { 
    this.profileValidator = new ProfileValidator();}

  ngOnInit(): void {
  }


}
