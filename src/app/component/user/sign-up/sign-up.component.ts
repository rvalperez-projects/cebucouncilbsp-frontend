import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ProfileLabels, SessionConstant } from 'src/app/constant/Constants';
import { Roles } from 'src/app/constant/Enums';
import { AreaDistrictsModel } from 'src/app/model/user-registration.model';
import { ProfileFormMessages } from '../../../constant/Messages';
import { ProfileFormGroup } from '../../../formGroups/ProfileFormGroup';
import { UserService } from '../../../service/user.service';
import { CouncilDialog } from '../../common-components/dialog/create-dialog-util';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../profile.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {

  @Output() close = new EventEmitter();

  // Declare object
  profileValidator: ProfileFormGroup;

  selectedDistrict: AreaDistrictsModel;
  passwordHide = true;
  confirmPasswordHide = true;
  showUserRoleField = false;
  
  // Combo box values
  Categories: any = ProfileLabels.categories;
  UserRoles: any = ProfileLabels.userRoles;
  Districts: string[];
  Areas: string[];
  private areaDistricts: AreaDistrictsModel[];

  // Error Messages
  errorMessages: Array<string>;
  
  constructor(
    public profileFormGroup: ProfileFormGroup,
    private councilDialog: CouncilDialog, 
    private service: UserService) { 
      this.Districts = [];
      this.Areas = [];
      this.areaDistricts = [];
  }

  ngOnInit(): void {
    this.service.getDistricts().subscribe((areaDistricts: AreaDistrictsModel[]) => {
      for (let item of areaDistricts) {
        let areaDistrict: AreaDistrictsModel = {area: item.area, district: item.district }
        this.areaDistricts.push(areaDistrict);
        this.Districts.push(item.district);
        this.Areas.push(item.area);
      }
    });
    let userRole = window.sessionStorage[SessionConstant.USER_ROLE_CODE_KEY];
    if (userRole && userRole != Roles.GENERAL_USER) {
      this.showUserRoleField = true;
    }
  }

  register() {
    // Set the Required Area and District Fields
    let selectedArea = null;
    let selectedDistrict = null;
    let successMessages = [];
    if (this.profileFormGroup.authorityCode.value != Roles.GENERAL_USER) {
      selectedArea = "Council";
      selectedDistrict = selectedArea;
      successMessages = [ProfileFormMessages.REGISTRATION_SUCCESSFUL_MESSAGE];
    } else {
      selectedArea = this.profileFormGroup.area.value;
      selectedDistrict = this.profileFormGroup.district.value;
      successMessages = [ProfileFormMessages.WELCOME_MESSAGE_1, ProfileFormMessages.WELCOME_MESSAGE_2];
    }
    this.profileFormGroup.area.setValue(selectedArea);
    this.profileFormGroup.district.setValue(selectedDistrict);

    // Check Errors
    if (this.hasErrors()) {
      return;
    }

    // Call Service
    this.service.registerUser(this.profileFormGroup).subscribe(() => {
      this.councilDialog.openDialog(ProfileFormMessages.SUBMISSION_SUCCESSFUL, successMessages);
      this.closeSignUp();
    });
  }

  private hasErrors(): boolean {    
    // Check Input Data
    this.errorMessages = [];
    
    // Check Password Match
    if (this.profileFormGroup.password.value && 
        this.profileFormGroup.password.value != this.profileFormGroup.confirmPassword.value) {
      this.errorMessages.push(ProfileFormMessages.PASSWORDS_NOT_MATCH);
    }

    // Check Individual Fields
    this.profileFormGroup.getErrorMessage(this.errorMessages);
    if (this.errorMessages.length > 0) {      
      this.councilDialog.openDialog(ProfileFormMessages.SUBMISSION_ERROR, this.errorMessages);
      return true;
    }
    return false;
  }

  closeSignUp() {
    this.close.emit(null);
  }

  toggleFields() {
    if (this.profileFormGroup.authorityCode.value != Roles.GENERAL_USER) {
      this.profileFormGroup.institutionName.disable();
      this.profileFormGroup.address.disable();
      this.profileFormGroup.categoryCode.disable();
      this.profileFormGroup.district.disable();
      this.profileFormGroup.contactNumber.disable();

      this.profileFormGroup.institutionName.setValue(null);
      this.profileFormGroup.address.setValue(null);
      this.profileFormGroup.categoryCode.setValue(null);
      this.profileFormGroup.district.setValue(null);
      this.profileFormGroup.area.setValue(null);
      this.profileFormGroup.contactNumber.setValue(null);
    } else {
      this.profileFormGroup.institutionName.enable();
      this.profileFormGroup.address.enable();
      this.profileFormGroup.categoryCode.enable();
      this.profileFormGroup.district.enable();
      this.profileFormGroup.contactNumber.enable();
    }
  }

  selectArea() {
    let selectedDistrict = this.profileFormGroup.district.value;
    for (let item of this.areaDistricts) {
      if (item.district == selectedDistrict) {
        this.profileFormGroup.area.setValue(item.area);
        break;
      }
    }
  }

}
