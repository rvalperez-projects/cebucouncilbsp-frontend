import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ProfileLabels } from 'src/app/constant/Constants';
import { AreaDistrictsModel } from 'src/app/model/user-registration.model';
import { ProfileFormMessages } from '../../../constant/Messages';
import { ProfileFormGroup } from '../../../formGroups/ProfileFormGroup';
import { UserService } from '../../../service/user.service';
import { CouncilDialog } from '../../common-components/dialog/create-dialog-util';

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
    this.service.getDistricts().subscribe((areaDistricts: AreaDistrictsModel[]) => {
      for (let item of areaDistricts) {
        let areaDistrict: AreaDistrictsModel = {area: item.area, district: item.district }
        this.AreaDistricts.push(areaDistrict);
      }
    });
  }

  register() {
    this.profileFormGroup.area.setValue(this.selectedDistrict.area);
    this.profileFormGroup.district.setValue(this.selectedDistrict.district);
    if (this.hasErrors()) {
      return;
    }

    this.service.registerUser(this.profileFormGroup).subscribe(() => {
      let messages = [ProfileFormMessages.WELCOME_MESSAGE_1, ProfileFormMessages.WELCOME_MESSAGE_2];
      this.councilDialog.openDialog(ProfileFormMessages.SUBMISSION_SUCCESSFUL, messages);
      this.closeSignUp();
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

  closeSignUp() {
    this.close.emit(null);
  }

}
