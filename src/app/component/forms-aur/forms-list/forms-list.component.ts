import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { InstitutionModel } from 'src/app/model/entities.model';
import { SessionConstant } from '../../../constant/Constants';
import { EnumUtil, FormStatus, Roles } from '../../../constant/Enums';
import { SearchFormGroup } from '../../../formGroups/FormListGroup';
import { FormListSearchResultsModel } from '../../../model/form-list.model';
import { SearchFormModel } from '../../../model/search-form.model';
import { AURFormListService } from '../../../service/aur-form-list.service';
import { SearchService } from '../../../service/search.service';

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
  displayedColumns: string[] = ['dateApplied', 'district', 'institution', 'unitNumber', 'aurNumber', 'status', 'lastUpdatedDate'];

  // User role
  private roleCode: string;

  constructor(
    public  route: ActivatedRoute,
    public  router: Router,
    private service: AURFormListService,
    private searchService: SearchService,
    private header: AppComponent,
    public searchFormGroup: SearchFormGroup
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

    // Populate Search Boxes
     this.searchService.initializeSearchBoxes().subscribe((result: any) => {
       
       switch(this.roleCode) {
        case Roles.GENERAL_USER: 
          let institution = result as InstitutionModel;
          this.searchFormData.institutionMap.set(institution.institutionId, institution);
          this.searchFormData.areaList = [institution.area];
          this.searchFormData.districtList = [institution.district];
    
          this.searchFormGroup.area.setValue(institution.area);
          this.searchFormGroup.district.setValue(institution.district);
          this.searchFormGroup.institutionId.setValue(institution.institutionId);
          break;
        case Roles.COUNCIL:
        case Roles.ADMIN:
          let mapResult = result as Map<string, Map<string, Map<number, string>>>;
          let area: string = Array.from(mapResult.keys())[0];
          let district: string = Array.from(mapResult.get(area).keys())[0];

          this.searchFormGroup.area.setValue(area);
          this.searchFormGroup.district.setValue(district);
          this.searchFormGroup.institutionId.setValue('');
          this.searchService.populateAreaDistrictBoxes(this.searchFormData, area);
          this.repopulateInstitutions();
          break;
       }
     });
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
    this.searchService.populateAreaDistrictBoxes(
      this.searchFormData, this.searchFormGroup.area.value, 
    );
    this.searchFormGroup.district.setValue(null);
    this.searchFormGroup.institutionId.setValue(null);
  }

  processAURForm(formId: any, status: string) {
    // Exit if no AUR form selected
    if (!status) {
      return;
    }

    if (this.roleCode != Roles.GENERAL_USER && status == EnumUtil.getEnumTextByValue(FormStatus, FormStatus.PAID)) {
      this.updateAURForm(formId);
    } else {
      this.viewAURForm(formId);
    }
  }

  searchAURForms() {
    this.service.searchAURForm(this.searchFormGroup).subscribe((data: Array<FormListSearchResultsModel>) => {
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
