import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SearchFormGroup } from 'src/app/formGroups/FormListGroup';
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
      let area: string = Object.keys(mapResult)[0];
      let district: string = Object.keys(mapResult[area])[0];

      this.searchFormGroup.area.setValue(area);
      this.searchFormGroup.district.setValue(district);
      this.searchFormGroup.institutionId.setValue('');
      this.searchService.populateSearchBoxes(this.searchFormData, area, district);
      this.addCouncilToAreaBox();
     });
  }
  
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  repopulateInstitutions() {
    this.searchService.populateSearchBoxes(this.searchFormData, 
      this.searchFormGroup.area.value, 
      this.searchFormGroup.district.value);
    this.searchFormGroup.institutionId.setValue(null);
    this.addCouncilToAreaBox();
  }

  repopulateDistrictAndInstitutions() {
    if (this.COUNCIL == this.searchFormGroup.area.value) {
      this.searchFormData.districtList = [];
      this.searchFormData.institutionMap.clear();
      this.searchFormGroup.district.setValue(null);
      this.searchFormGroup.institutionId.setValue(null);
      return;
    }
    
    this.searchService.populateSearchBoxes(
      this.searchFormData, this.searchFormGroup.area.value, null);
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
    this.isProfileClicked = true;
    this.selectedUserId = userId;
    this.cdRef.detectChanges();
  }

  createNewUser() {
    this.isSignUpClicked = true;
    this.cdRef.detectChanges();
  }

  addCouncilToAreaBox() {
    this.searchFormData.areaList.push(this.COUNCIL);
  }

}
