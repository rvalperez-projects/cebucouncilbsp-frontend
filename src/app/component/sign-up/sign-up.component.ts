import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { SignUpService } from '../../service/sign-up.service';
import { ProfileFormGroup } from '../../formGroups/ProfileFormGroup';
import { ProfileLabels, AreaDistrictsInterface } from '../../constant/Constants';
import { ProfileErrorMessages } from '../../constant/Messages';
import { CouncilDialog } from '../dialog/create-dialog-util';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {

  @Output() close = new EventEmitter();

  // Declare object
  profileValidator: ProfileFormGroup;

  selectedDistrict: AreaDistrictsInterface;
  passwordHide = true;
  confirmPasswordHide = true;
  
  // Combo box values
  Categories: any = ProfileLabels.categories;
  AreaDistricts: AreaDistrictsInterface[];

  // Error Messages
  errorMessages: Array<string>;
  
  constructor(
    public profileFormGroup: ProfileFormGroup,
    private councilDialog: CouncilDialog, 
    private service: SignUpService) { 
      this.AreaDistricts = [];
  }

  ngOnInit(): void {
    console.log()
    this.service.getDistricts().subscribe((areaDistricts: AreaDistrictsInterface[]) => {
      for (let item of areaDistricts) {
        let areaDistrict: AreaDistrictsInterface = {area: item.area, district: item.district }
        this.AreaDistricts.push(areaDistrict);
      }
    });
  }

  register() {
    this.profileFormGroup.area.setValue(this.selectedDistrict.area);
    this.profileFormGroup.district.setValue(this.selectedDistrict.district);
    if (!this.hasErrors()) {
      this.service.registerUser(this.profileFormGroup).subscribe(() => {
        console.log("Successfully registered!");
      });
    }
  }

  private hasErrors(): boolean {    
    // Check Input Data
    this.errorMessages = [];
    this.profileFormGroup.getErrorMessage(this.errorMessages);
    if (this.errorMessages.length > 0) {      
      this.councilDialog.openDialog(ProfileErrorMessages.SUBMISSION_ERROR, this.errorMessages);
      return true;
    }
    return false;
  }

  closeSignUp() {
    this.close.emit(null);
  }

}
