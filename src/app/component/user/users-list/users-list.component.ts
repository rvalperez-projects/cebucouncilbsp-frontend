import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SearchFormGroup } from 'src/app/formGroups/FormListGroup';
import { InstitutionModel } from 'src/app/model/entities.model';
import { SearchFormModel } from 'src/app/model/search-form.model';
import { ProfileInfo } from 'src/app/model/user-registration.model';
import { SearchService } from 'src/app/service/search.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterContentChecked {

  // Declare combo box data
  searchFormData: SearchFormModel;

  // Set table data
  dataSource: Array<ProfileInfo>;
  displayedColumns: string[] = ['district', 'institutionName', 'name', 'mobileNumber', 'emailAddress'];
  readonly COUNCIL: string = "Council";

  isProfileClicked: boolean;
  isSignUpClicked: boolean;
  selectedUserId: number;

  constructor(
    private service: UserService,
    private searchService: SearchService,
    private header: AppComponent,
    public searchFormGroup: SearchFormGroup,
    private cdRef: ChangeDetectorRef
  ) {
    this.searchFormData = new SearchFormModel();
    this.dataSource = new Array<ProfileInfo>();
    let blankForm = new ProfileInfo();
    this.dataSource.push(blankForm);
  }

  ngOnInit(): void {
    this.header.initLoggedInUser();
    
    // Populate Search Boxes
     this.searchService.initializeSearchBoxes().subscribe((result: any) => {
       
      let mapResult = result as Map<string, Map<string, Map<number, string>>>;
      let area: string = Array.from(mapResult.keys())[0];
      let district: string = Array.from(mapResult.get(area).keys())[0];

      this.searchFormGroup.area.setValue(area);
      this.searchFormGroup.district.setValue(district);
      this.searchFormGroup.institutionId.setValue('');
      this.searchService.populateAreaDistrictBoxes(this.searchFormData, area);
      this.repopulateInstitutions();
      this.addCouncilToAreaBox();
     });
  }
  
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  repopulateInstitutions() {
    this.searchService.getInstitutionsByAreaAndDistrict(
      this.searchFormGroup.area.value, this.searchFormGroup.district.value
    ).subscribe((institutions: Array<InstitutionModel>) => {
      let institutionMap = new Map<number, InstitutionModel>();
      for (let institution of institutions) {
        institutionMap.set(institution.institutionId, institution);
      }
      this.searchService.populateInstitutionBoxes(this.searchFormData, institutionMap);
      this.searchFormGroup.institutionId.setValue(institutions[0].institutionId);
    });
  }

  repopulateDistrictAndInstitutions() {
    if (this.COUNCIL == this.searchFormGroup.area.value) {
      this.searchFormData.districtList = [];
      this.searchFormData.institutionMap.clear();
      this.searchFormGroup.district.setValue(null);
      this.searchFormGroup.institutionId.setValue(null);
      return;
    }
    
    this.searchService.populateAreaDistrictBoxes(
      this.searchFormData, this.searchFormGroup.area.value
    );
    this.searchFormGroup.district.setValue(null);
    this.searchFormGroup.institutionId.setValue(null);
    this.addCouncilToAreaBox();
  }

  searchUsers() {
    this.service.searchUsers(this.searchFormGroup).subscribe((data: Array<ProfileInfo>) => {
      this.dataSource = data;
    });
  }

  openProfile(userId) {
    if (userId) {
      this.isProfileClicked = true;
      this.selectedUserId = userId;
      this.cdRef.detectChanges();
    }
  }

  createNewUser() {
    this.isSignUpClicked = true;
    this.cdRef.detectChanges();
  }

  addCouncilToAreaBox() {
    this.searchFormData.areaList.push(this.COUNCIL);
  }

}
