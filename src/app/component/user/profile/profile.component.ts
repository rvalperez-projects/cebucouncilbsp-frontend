import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs/operators';
import { AreaDistrictsModel, ProfileInfo } from 'src/app/model/user-registration.model';
import { ProfileLabels, SessionConstant } from '../../../constant/Constants';
import { Roles } from '../../../constant/Enums';
import { ProfileFormMessages } from '../../../constant/Messages';
import { ProfileFormGroup } from '../../../formGroups/ProfileFormGroup';
import { UserService } from '../../../service/user.service';
import { CouncilDialog } from '../../common-components/dialog/create-dialog-util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../profile.component.css'],
  providers:  [ ProfileFormGroup ],
  encapsulation : ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  @Input() inputUserId: number;
  @Output() close = new EventEmitter();

  // Declare object
  profileValidator: ProfileFormGroup;

  passwordHide = true;
  confirmPasswordHide = true;
  
  // Combo box values
  Categories: any = ProfileLabels.categories;
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
      
    // Get User details
    let userId = this.inputUserId;
    this.service.getUserDetails(userId).subscribe((profileInfo : ProfileInfo) => {
      // Set values
      this.profileFormGroup.patchValues(profileInfo);

      if (profileInfo.authorityCode == Roles.GENERAL_USER) {
        // Get ALL Area and District combo items
        this.service.getDistricts().pipe(
          map((areaDistricts: AreaDistrictsModel[]) => {
            this.areaDistricts = areaDistricts;

            // Get initial value
            let userAreaDistrict: AreaDistrictsModel = null;
            for (let item of areaDistricts) {
              this.Districts.push(item.district);
              this.Areas.push(item.area);
              if (!userAreaDistrict && 
                  item.area == profileInfo.area && item.district == profileInfo.district) {
                userAreaDistrict = new AreaDistrictsModel(item.area, item.district);
              }
            }
            return userAreaDistrict;
          })
        ).subscribe((userAreaDistrict: AreaDistrictsModel) => {
          // Set initial value
          this.profileFormGroup.district.setValue(userAreaDistrict.district);
          this.profileFormGroup.area.setValue(userAreaDistrict.area);
        });
      } else {
        this.profileFormGroup.categoryCode.disable();
        this.profileFormGroup.district.disable();
        this.profileFormGroup.area.disable();
      }
    });
  }

  update() {
    // Set dummy password if password is NOT set
    if (!this.profileFormGroup.password.value) {
      this.profileFormGroup.password.setValue('x----x');
      this.profileFormGroup.confirmPassword.setValue('x----x');
    }
    
    // Set Area and District
    if (this.profileFormGroup.authorityCode.value != Roles.GENERAL_USER) {
      this.profileFormGroup.area.setValue("Council");
      this.profileFormGroup.district.setValue("Council");
    }
    if (this.hasErrors()) {
      return;
    }

    // Call Update User Service
    this.service.updateUser(this.profileFormGroup).subscribe((updatedProfile: ProfileInfo) => {
      window.sessionStorage[SessionConstant.USER_GIVEN_NAME] = updatedProfile.givenName;
      window.sessionStorage[SessionConstant.USER_INSTITUTION_ID_KEY] = updatedProfile.institutionId;
      this.closeWindow();

      // Reload page if signed in is a General User
      this.councilDialog.openConfirmDialog(ProfileFormMessages.SUBMISSION_SUCCESSFUL, 
        ProfileFormMessages.UPDATE_SUCCESSFUL_MESSAGE).subscribe((ok) => {
        if (ok && Roles.GENERAL_USER == window.sessionStorage[SessionConstant.USER_ROLE_CODE_KEY]) {
          location.reload();
        }
      });
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

  closeWindow() {
    this.close.emit(null);
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
