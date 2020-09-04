import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProfileInfo } from 'src/app/model/user-registration.model';
import { AreaDistrictsInterface, ProfileLabels, SessionConstant } from '../../../constant/Constants';
import { Roles } from '../../../constant/Enums';
import { ProfileFormMessages } from '../../../constant/Messages';
import { ProfileFormGroup } from '../../../formGroups/ProfileFormGroup';
import { SignUpService } from '../../../service/sign-up.service';
import { CouncilDialog } from '../../common-components/dialog/create-dialog-util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:  [ ProfileFormGroup ],
  encapsulation : ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

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
      
    // Get User details
    let userId = window.sessionStorage[SessionConstant.USER_ID_KEY];
    this.service.getUserDetails(userId).subscribe((profileInfo : ProfileInfo) => {
      // Set values
      this.profileFormGroup.patchValues(profileInfo);

      // Set Area / District combo box value
      let areaDistrict: AreaDistrictsInterface = {area: profileInfo.area, district: profileInfo.district };
      
      // Disable fields if NOT allowed to update
      if (!this.isAllowedToUpdate()) {
        for (let ctrl in this.profileFormGroup.form.controls) {
          let control = this.profileFormGroup.form.controls[ctrl] as FormControl;
          control.disable();
        }
        // Push only one AreaDistrict item
        this.AreaDistricts.push(areaDistrict);
      } else {

        if (profileInfo.authorityCode == Roles.GENERAL_USER) {
          // Get ALL Area and District combo items
          this.service.getDistricts().subscribe((areaDistricts: AreaDistrictsInterface[]) => {
            for (let item of areaDistricts) {
              let areaDistrict: AreaDistrictsInterface = {area: item.area, district: item.district }
              this.AreaDistricts.push(areaDistrict);
            }
          });
        } else {
          this.profileFormGroup.categoryCode.disable();
          this.profileFormGroup.district.disable();
        }
      }

      // Set initial value
      this.profileFormGroup.district.setValue(areaDistrict);
    });
  }

  update() {
    if (!this.hasErrors()) {
      this.profileFormGroup.area.setValue(this.selectedDistrict.area);
      this.profileFormGroup.district.setValue(this.selectedDistrict.district);

      // this.service.registerUser(this.profileFormGroup).subscribe(() => {
      //   let messages = [ProfileFormMessages.WELCOME_MESSAGE_1, ProfileFormMessages.WELCOME_MESSAGE_2];
      //   this.councilDialog.openDialog(ProfileFormMessages.SUBMISSION_SUCCESSFUL, messages);
      //   this.closeWindow();
      // });
    }
  }

  private hasErrors(): boolean {    
    // Check Input Data
    this.errorMessages = [];
    this.profileFormGroup.getErrorMessage(this.errorMessages);
    if (this.errorMessages.length > 0) {      
      this.councilDialog.openDialog(ProfileFormMessages.SUBMISSION_ERROR, this.errorMessages);
      return true;
    }
    return false;
  }

  closeWindow() {
    this.close.emit(null);
  }

  isAllowedToUpdate() {
    return window.sessionStorage[SessionConstant.USER_ROLE_CODE_KEY] != Roles.GENERAL_USER;
  }
}
