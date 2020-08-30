import { Component, OnInit } from '@angular/core';
import { ProfileFormGroup } from '../../../formGroups/ProfileFormGroup';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:  [ ProfileFormGroup ]
})
export class ProfileComponent implements OnInit {

  // Declare object

  selectedDistrict: string;
  selectedArea: string;
  selectedCategory: string;
  passwordHide = true;
  confirmPasswordHide = true;
  profileValidator: ProfileFormGroup;
  
  // Combo box values
  Categories: any = ['Primary', 'Secondary'];
  Districts: any = ['North 1', 'North 2'];
  Areas: any = ['I', 'II', 'III'];

  
  constructor(
    public profileFormGroup: ProfileFormGroup) { 
  }

  ngOnInit(): void {
  }

  getErrorMessage() {
    // return this.profileFormGroup.getErrorMessage();
  }


}
