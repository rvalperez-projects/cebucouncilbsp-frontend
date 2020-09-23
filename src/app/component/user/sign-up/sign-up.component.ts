import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ProfileLabels, SessionConstant } from 'src/app/constant/Constants';
import { Roles } from 'src/app/constant/Enums';
import { InstitutionModel } from 'src/app/model/entities.model';
import { SearchFormModel } from 'src/app/model/search-form.model';
import { AreaDistrictsModel } from 'src/app/model/user-registration.model';
import { SearchService } from 'src/app/service/search.service';
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
  isNewInstitution = false;
  isGeneralUser = true;
  
  // Combo box values
  searchFormData: SearchFormModel;
  Categories: any = ProfileLabels.categories;
  UserRoles: any = ProfileLabels.userRoles;
  private newInstitution: InstitutionModel;

  // Error Messages
  errorMessages: Array<string>;
  
  constructor(
    private councilDialog: CouncilDialog,
    public profileFormGroup: ProfileFormGroup,
    private searchService: SearchService,
    private service: UserService) { 
      this.searchFormData = new SearchFormModel();
      this.newInstitution = new InstitutionModel("New");
  }

  ngOnInit(): void {
    
    this.searchService.initializeSearchBoxes().subscribe((result: any) => {
      let mapResult = result as Map<string, Map<string, Map<number, string>>>;
      let area: string = Object.keys(mapResult)[0];
      let district: string = Object.keys(mapResult[area])[0];

      this.profileFormGroup.area.setValue(area);
      this.profileFormGroup.district.setValue(district);
      this.profileFormGroup.institutionId.setValue('');
      this.searchService.populateSearchBoxes(this.searchFormData, area, district);
      this.searchFormData.institutionMap.set(-1, this.newInstitution);
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
      this.isGeneralUser = false;
      this.profileFormGroup.address.disable();
      this.profileFormGroup.contactNumber.disable();

      this.profileFormGroup.area.setValue("Council");
      this.profileFormGroup.district.setValue("Council");
      this.profileFormGroup.institutionName.setValue("Council");
      this.profileFormGroup.address.setValue(null);
      this.profileFormGroup.categoryCode.setValue(null);
      this.profileFormGroup.contactNumber.setValue(null);
    } else {
      this.isGeneralUser = true;
      this.profileFormGroup.institutionName.enable();
      this.profileFormGroup.address.enable();
      this.profileFormGroup.categoryCode.enable();
      this.profileFormGroup.district.enable();
      this.profileFormGroup.contactNumber.enable();
    }
  }

  repopulateInstitutions() {
    this.searchService.populateSearchBoxes(this.searchFormData, 
      this.profileFormGroup.area.value, 
      this.profileFormGroup.district.value);
    this.profileFormGroup.institutionId.setValue(null);
    this.searchFormData.institutionMap.set(-1, this.newInstitution);
  }

  repopulateDistrictAndInstitutions() {
    this.searchService.populateSearchBoxes(this.searchFormData, 
      this.profileFormGroup.area.value, 
      null);
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
