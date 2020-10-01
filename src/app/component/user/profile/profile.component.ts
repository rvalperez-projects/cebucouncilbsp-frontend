import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { InstitutionModel } from 'src/app/model/entities.model';
import { SearchFormModel } from 'src/app/model/search-form.model';
import { ProfileInfo } from 'src/app/model/user-registration.model';
import { SearchService } from 'src/app/service/search.service';
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
  isNewInstitution = false;
  isGeneralUser = true;
  
  // Combo box values
  searchFormData: SearchFormModel;
  Categories: any = ProfileLabels.categories;
  private newInstitution: InstitutionModel;

  // Error Messages
  errorMessages: Array<string>;
  
  constructor(
    public profileFormGroup: ProfileFormGroup,
    private councilDialog: CouncilDialog, 
    private searchService: SearchService,
    private service: UserService) { 
      this.searchFormData = new SearchFormModel();
      this.newInstitution = new InstitutionModel("New");
  }

  ngOnInit(): void {
      
      // Get User details
    let userId = this.inputUserId;
    let userRole = window.sessionStorage[SessionConstant.USER_ROLE_CODE_KEY];
    this.service.getUserDetails(userId).subscribe((profileInfo : ProfileInfo) => {
      this.isGeneralUser = profileInfo.authorityCode == Roles.GENERAL_USER;
      
      // Set Combo Boxes
      this.searchService.initializeSearchBoxes().subscribe((result: any) => {

        if (userRole != Roles.GENERAL_USER && profileInfo.authorityCode == Roles.GENERAL_USER) {
          // Get ALL Area and District combo items
          this.searchService.populateAreaDistrictBoxes(this.searchFormData, profileInfo.area);
          this.repopulateInstitutions();
          this.searchFormData.institutionMap.set(-1, this.newInstitution);
          
          // Enable Fields
          this.profileFormGroup.area.enable();
          this.profileFormGroup.district.enable();
          this.profileFormGroup.institutionId.enable();
          this.profileFormGroup.address.enable();
          this.profileFormGroup.categoryCode.enable();
          this.profileFormGroup.contactNumber.enable();
        } else {
          this.searchFormData.areaList.push(profileInfo.area);
          this.searchFormData.districtList.push(profileInfo.district);
          this.searchFormData.institutionMap.set(profileInfo.institutionId, new InstitutionModel(profileInfo.institutionName));
          
          // Disable Fields
          this.profileFormGroup.area.disable();
          this.profileFormGroup.district.disable();
          this.profileFormGroup.institutionId.disable();
          this.profileFormGroup.address.disable();
          this.profileFormGroup.categoryCode.disable();
          this.profileFormGroup.contactNumber.disable();
        }
        
        // Set values
        this.profileFormGroup.patchValues(profileInfo);
        this.profileFormGroup.institutionId.setValue(profileInfo.institutionId);
        this.profileFormGroup.institutionName.setValue(profileInfo.institutionName);
      });
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
      this.profileFormGroup.institutionName.setValue("Council");
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

  repopulateInstitutions() {
    this.searchService.getInstitutionsByAreaAndDistrict(
      this.profileFormGroup.area.value, this.profileFormGroup.district.value
    ).subscribe((institutions: Array<InstitutionModel>) => {
      let institutionMap = new Map<number, InstitutionModel>();
      for (let institution of institutions) {
        institutionMap.set(institution.institutionId, institution);
      }
      this.searchService.populateInstitutionBoxes(this.searchFormData, institutionMap);
      this.profileFormGroup.institutionId.setValue(institutions[0].institutionId);
    });
  }

  repopulateDistrictAndInstitutions() {
    this.searchService.populateAreaDistrictBoxes(
      this.searchFormData, this.profileFormGroup.area.value
    );
    this.profileFormGroup.district.setValue(null);
    this.profileFormGroup.institutionId.setValue(null);
    this.searchFormData.institutionMap.set(-1, this.newInstitution);
  }

  selectedOtherInstitution() {
    if (this.profileFormGroup.institutionId.value == -1) {
      this.isNewInstitution = true;

      // Enable Fields
      this.profileFormGroup.institutionName.setValue(null);
      this.profileFormGroup.address.setValue(null);
      this.profileFormGroup.categoryCode.setValue(null);
      this.profileFormGroup.contactNumber.setValue(null);
    } else {
      this.isNewInstitution = false;

      // Set values from selected institution
      let institution: InstitutionModel = this.searchFormData.institutionMap.get(this.profileFormGroup.institutionId.value);
      this.profileFormGroup.institutionName.setValue(institution.institutionName);
      this.profileFormGroup.address.setValue(institution.address);
      this.profileFormGroup.categoryCode.setValue(institution.categoryCode);
      this.profileFormGroup.contactNumber.setValue(institution.contactNumber);
    }
  }

}
