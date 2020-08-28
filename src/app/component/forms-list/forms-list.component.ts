import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsListService } from '../../service/forms-list.service';
import { SearchFormModel } from '../../model/search-form.model';
import { AURFormListFormGroup } from '../../formGroups/FormListGroup';
import { FormListSearchResultsModel } from '../../model/form-list.model';
import { SessionConstant, Roles, EnumUtil } from '../../constant/Enums';
import { InstitutionModel } from 'src/app/model/entities.model';

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
  displayedColumns: string[] = ['dateApplied', 'district', 'institution', 'aurNumber', 'status', 'lastUpdatedDate', 'actions'];

  constructor(
    public  route: ActivatedRoute,
    public  router: Router,
    private service: FormsListService,
    public aurFormListFormGroup: AURFormListFormGroup
  ) {
    this.searchFormData = new SearchFormModel();
    this.dataSource = new Array<FormListSearchResultsModel>();
    let blankForm = new FormListSearchResultsModel();
    this.dataSource.push(blankForm);
    this.userRole = window.sessionStorage[SessionConstant.USER_ROLE_CODE_KEY];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // this.name = params['name'];
    }); 
    
    let roleCode = window.sessionStorage.getItem(SessionConstant.USER_ROLE_CODE_KEY);
    let role = EnumUtil.getEnumValueByValue(Roles, roleCode);

    // Populate Search Boxes
     this.service.initializeSearchBoxes().subscribe((result: any) => {
       
       switch(role) {
        case Roles.GENERAL_USER: 
          let institution = result as InstitutionModel;
          this.searchFormData.institutionMap.set(institution.institutionId, institution.institutionName);
          this.searchFormData.areaList = [institution.area];
          this.searchFormData.districtList = [institution.district];
    
          this.aurFormListFormGroup.area.setValue(institution.area);
          this.aurFormListFormGroup.district.setValue(institution.district);
          this.aurFormListFormGroup.institution.setValue(institution.institutionId);
          break;
        case Roles.COUNCIL:
        case Roles.ADMIN:
          let mapResult = result as Map<string, Map<string, Map<number, string>>>;
          let area: string = Object.keys(mapResult)[0];
          let district: string = Object.keys(mapResult[area])[0];

          this.aurFormListFormGroup.area.setValue(area);
          this.aurFormListFormGroup.district.setValue(district);
          this.aurFormListFormGroup.institution.setValue('');
          this.service.populateSearchBoxes(this.searchFormData, area, district);
          break;
       }
     });
  }

  repopulateInstitutions() {
    this.service.populateSearchBoxes(this.searchFormData, 
      this.aurFormListFormGroup.area.value, 
      this.aurFormListFormGroup.district.value);
  }

  repopulateDistrictAndInstitutions() {
    this.service.populateSearchBoxes(this.searchFormData, 
      this.aurFormListFormGroup.area.value, 
      null);
  }

  searchAURForms() {
    this.service.searchAURForm(this.aurFormListFormGroup).subscribe((data: Array<FormListSearchResultsModel>) => {
      this.dataSource = data;
    });
  }

  viewAURForm(id: any) {
    // Navigate to Form
    if (id) {
      this.router.navigateByUrl('/forms/'+id);
    }
  }

  updateAURForm(id: any) {
    // Navigate to Form
    if (id) {
      this.router.navigateByUrl('/forms/update/'+id);
    }
  }
}
