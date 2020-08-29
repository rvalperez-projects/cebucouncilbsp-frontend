import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsListService } from '../../service/forms-list.service';
import { SearchFormModel } from '../../model/search-form.model';
import { AURFormListFormGroup } from '../../formGroups/FormListGroup';
import { FormListSearchResultsModel } from '../../model/form-list.model';
import { SessionConstant } from '../../constant/Constants';
import { Roles, EnumUtil, FormStatus } from '../../constant/Enums';
import { InstitutionModel } from 'src/app/model/entities.model';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormsListComponent implements OnInit {

  // Declare combo box data
  searchFormData: SearchFormModel;
  userRole: string;

  // Set table data
  dataSource: Array<FormListSearchResultsModel>;
  displayedColumns: string[] = ['dateApplied', 'district', 'institution', 'aurNumber', 'status', 'lastUpdatedDate'];

  // User role
  private roleCode: string;
  private role: string;

  constructor(
    public  route: ActivatedRoute,
    public  router: Router,
    private service: FormsListService,
    private header: AppComponent,
    public aurFormListFormGroup: AURFormListFormGroup
  ) {
    this.searchFormData = new SearchFormModel();
    this.dataSource = new Array<FormListSearchResultsModel>();
    let blankForm = new FormListSearchResultsModel();
    this.dataSource.push(blankForm);
    this.userRole = window.sessionStorage[SessionConstant.USER_ROLE_CODE_KEY];
  }

  ngOnInit(): void {
    this.header.initLoggedInUser();
    this.route.queryParams.subscribe(params => {
      // this.name = params['name'];
    }); 
    
    this.roleCode = window.sessionStorage.getItem(SessionConstant.USER_ROLE_CODE_KEY);
    this.role = EnumUtil.getEnumValueByValue(Roles, this.roleCode);

    // Populate Search Boxes
     this.service.initializeSearchBoxes().subscribe((result: any) => {
       
       switch(this.role) {
        case Roles.GENERAL_USER: 
          let institution = result as InstitutionModel;
          this.searchFormData.institutionMap.set(institution.institutionId, institution.institutionName);
          this.searchFormData.areaList = [institution.area];
          this.searchFormData.districtList = [institution.district];
    
          this.aurFormListFormGroup.area.setValue(institution.area);
          this.aurFormListFormGroup.district.setValue(institution.district);
          this.aurFormListFormGroup.institutionId.setValue(institution.institutionId);
          break;
        case Roles.COUNCIL:
        case Roles.ADMIN:
          let mapResult = result as Map<string, Map<string, Map<number, string>>>;
          let area: string = Object.keys(mapResult)[0];
          let district: string = Object.keys(mapResult[area])[0];

          this.aurFormListFormGroup.area.setValue(area);
          this.aurFormListFormGroup.district.setValue(district);
          this.aurFormListFormGroup.institutionId.setValue('');
          this.service.populateSearchBoxes(this.searchFormData, area, district);
          break;
       }
     });
  }

  repopulateInstitutions() {
    this.service.populateSearchBoxes(this.searchFormData, 
      this.aurFormListFormGroup.area.value, 
      this.aurFormListFormGroup.district.value);
    this.aurFormListFormGroup.institutionId.setValue(null);
  }

  repopulateDistrictAndInstitutions() {
    this.service.populateSearchBoxes(this.searchFormData, 
      this.aurFormListFormGroup.area.value, 
      null);
      this.aurFormListFormGroup.district.setValue(null);
      this.aurFormListFormGroup.institutionId.setValue(null);
  }

  processAURForm(formId: any, status: string) {
    // Exit if no AUR form selected
    if (!status) {
      return;
    }

    if (this.roleCode != Roles.GENERAL_USER && status == EnumUtil.getEnumTextByValue(FormStatus, FormStatus.SUBMITTED)) {
      this.updateAURForm(formId);
    } else {
      this.viewAURForm(formId);
    }
  }

  searchAURForms() {
    this.service.searchAURForm(this.aurFormListFormGroup).subscribe((data: Array<FormListSearchResultsModel>) => {
      this.dataSource = data;
    });
  }

  private viewAURForm(id: any) {
    // Navigate to Form
    if (id) {
      this.router.navigateByUrl('/forms/view', {state:{formId:id}});
    }
  }

  private updateAURForm(id: any) {
    // Navigate to Form
    if (id) {
      this.router.navigateByUrl('/forms/update', {state:{formId:id}});
    }
  }
}
