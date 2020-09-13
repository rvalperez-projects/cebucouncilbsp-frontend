import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  styleUrls: ['./profile.component.css'],
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
      
      // Disable fields if NOT allowed to update
      if (!this.isAllowedToUpdate()) {
        for (let ctrl in this.profileFormGroup.form.controls) {
          let control = this.profileFormGroup.form.controls[ctrl] as FormControl;
          control.disable();
        }
        // Push only one AreaDistrict item
        this.AreaDistricts.push(userAreaDistrict);
        this.profileFormGroup.district.setValue(userAreaDistrict);
      } else {

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
      }
    });
  }

  update() {
    this.profileFormGroup.area.setValue(this.selectedDistrict.area);
    this.profileFormGroup.district.setValue(this.selectedDistrict.district);
    if (this.hasErrors()) {
      return;
    }

    // this.service.registerUser(this.profileFormGroup).subscribe(() => {
    //   let messages = [ProfileFormMessages.WELCOME_MESSAGE_1, ProfileFormMessages.WELCOME_MESSAGE_2];
    //   this.councilDialog.openDialog(ProfileFormMessages.SUBMISSION_SUCCESSFUL, messages);
    //   this.closeWindow();
    // });
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
