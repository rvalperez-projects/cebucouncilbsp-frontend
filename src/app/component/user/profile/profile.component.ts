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

  selectedDistrict: AreaDistrictsModel;
  passwordHide = true;
  confirmPasswordHide = true;
  
  // Combo box values
  Categories: any = ProfileLabels.categories;
  AreaDistricts: AreaDistrictsModel[];

  // Error Messages
  errorMessages: Array<string>;
  
  constructor(
    public profileFormGroup: ProfileFormGroup,
    private councilDialog: CouncilDialog, 
    private service: UserService) { 
      this.AreaDistricts = [];
  }

  ngOnInit(): void {
      
    // Get User details
    let userId = this.inputUserId;
    this.service.getUserDetails(userId).subscribe((profileInfo : ProfileInfo) => {
      // Set values
      this.profileFormGroup.patchValues(profileInfo);

      // Set Area / District combo box value
      let userAreaDistrict: AreaDistrictsModel = {area: profileInfo.area, district: profileInfo.district };
      
      if (profileInfo.authorityCode == Roles.GENERAL_USER) {
        // Get ALL Area and District combo items
        this.service.getDistricts().pipe(
          map((areaDistricts: AreaDistrictsModel[]) => {
            let userAreaDistrict: AreaDistrictsModel = null;
            for (let item of areaDistricts) {
              let areaDistrict = new AreaDistrictsModel(item.area, item.district);
              this.AreaDistricts.push(areaDistrict);
              if (!userAreaDistrict && areaDistrict.area == profileInfo.area && areaDistrict.district == profileInfo.district) {
                userAreaDistrict = areaDistrict;
              }
            }
            return userAreaDistrict;
          })
        ).subscribe((userAreaDistrict: AreaDistrictsModel) => {
          // Set initial value
          this.profileFormGroup.district.setValue(userAreaDistrict);
        });
      } else {
        this.profileFormGroup.categoryCode.disable();
        this.profileFormGroup.district.disable();
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
    if (this.profileFormGroup.authorityCode.value == Roles.GENERAL_USER) {
      this.profileFormGroup.area.setValue(this.profileFormGroup.district.value.area);
      this.profileFormGroup.district.setValue(this.profileFormGroup.district.value.district);
    } else {
      this.profileFormGroup.area.setValue("Council");
      this.profileFormGroup.district.setValue("Council");
    }
    if (this.hasErrors()) {
      return;
    }

    // Call Update User Service
    this.service.updateUser(this.profileFormGroup).subscribe((updatedProfile: ProfileInfo) => {
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
}
