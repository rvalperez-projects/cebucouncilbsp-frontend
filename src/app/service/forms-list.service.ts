import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionConstant, Roles, EnumUtil, FormStatus } from '../constant/Constants';
import { ResourceURL } from '../constant/ResourceURL';
import { SearchFormModel } from '../model/search-form.model';
import { InstitutionModel } from '../model/entities.model';
import { BaseResponse } from '../model/base-response.model';
import { AURFormListFormGroup } from '../formGroups/FormListGroup';
import { FormListSearchResultsModel } from '../model/form-list.model';

@Injectable({
  providedIn: 'root'
})
export class FormsListService {

  private role: Roles;
  private institutionId: string;
  private boxValues: Map<string, Map<string, Map<number, string>>>;

  constructor(
    private http: HttpClient
   ) { 
     this.boxValues = new Map<string, Map<string, Map<number, string>>>();
  }

  public initializeSearchBoxes() {

    let searchFormModel: SearchFormModel = new SearchFormModel();

    let promise = new Promise(() => {

      // Get info from session
      let roleCode = window.sessionStorage.getItem(SessionConstant.USER_ROLE_CODE_KEY);
      this.role = EnumUtil.getEnumValueByValue(Roles, roleCode);
      this.institutionId = window.sessionStorage.getItem(SessionConstant.USER_INSTITUTION_ID_KEY);

      // Determine API to call
      switch(this.role) {
        case Roles.GENERAL_USER: 
          this.populateInstitutionBox().then((institution: InstitutionModel) => {
            searchFormModel.institutionMap.set(institution.institutionId, institution.institutionName);
            searchFormModel.areaList = [institution.area];
            searchFormModel.districtList = [institution.district];
          });
          break;
        case Roles.COUNCIL:
        case Roles.ADMIN:
          this.populateAreaDistrictInstitutionBoxes().then((result: Map<string, Map<string, Map<number, string>>>) => {
            this.boxValues = result;

            let area: string = Object.keys(this.boxValues)[0];
            let district: string = Object.keys(this.boxValues[area])[0];
            this.populateSearchBoxes(searchFormModel, area, district);
          });
          break;
      }
    });
    return searchFormModel;
  }

  public populateSearchBoxes(searchFormModel: SearchFormModel, areaInput: string, districtInput: string) {

    if (this.role == Roles.GENERAL_USER) {
      return;
    }

    let areas: Array<string> = [];
    let districts: Array<string> = [];
    let institutionMap = new Map<number, string>();

    for (let area of Object.keys(this.boxValues)) {
      areas.push(area);
    }
    for (let district of Object.keys(this.boxValues[areaInput])) {
      districts.push(district);
    }
    if (!districtInput) {
      districtInput = districts[0];
    }
    let institutions = this.boxValues[areaInput][districtInput];
    for (let institution of Object.keys(institutions)) {
      institutionMap.set(Number.parseInt(institution), institutions[institution]);
    }
    searchFormModel.institutionMap = institutionMap;
    searchFormModel.areaList = areas;
    searchFormModel.districtList = districts;
  }

  private populateInstitutionBox() {
    let promise = new Promise ((resolve, reject) => {

      // Call API
      return this.http.get<BaseResponse>(ResourceURL.HOST + 
        ResourceURL.INSTITUTION_ID.replace('{institutionId}', this.institutionId))
        .toPromise()
        .then(data => {
            resolve(data.result);
        });
    });
    return promise;
  }

  private populateAreaDistrictInstitutionBoxes() {
    
    let promise = new Promise((resolve, reject) => {
      // Call API
      this.http.get<BaseResponse>(ResourceURL.HOST + ResourceURL.AREA_DISTRICTS_INSTITUTIONS)
        .toPromise()
        .then(data => {
          resolve(data.result);
        });
    });
    return promise;
  }

  public searchAURForm(searchFormGroup: AURFormListFormGroup) {

    let promise = new Promise((resolve) => {

      let body = {
        "area": searchFormGroup.area.value,
        "district": searchFormGroup.district.value,
        "institution": searchFormGroup.institution.value,
        "name": searchFormGroup.name.value
      };
      this.http.post<BaseResponse>(ResourceURL.HOST + ResourceURL.FORM_SEARCH, JSON.stringify(body))
        .toPromise()
        .then( data => {
          let tableData = new Array<FormListSearchResultsModel>();
          for (let obj of data.result) {
            let data = new FormListSearchResultsModel();
            data.formId = obj.formId;
            data.aurNumber = obj.unitRegistrationNo;
            data.institution = obj.institutionName;
            data.district = obj.district;
            data.dateApplied = obj.dateApplied;
            data.lastUpdatedDate = obj.updatedDateTime;
            data.status = EnumUtil.getEnumTextByValue(FormStatus, obj.statusCode);
            tableData.push(data);
          }
          resolve(tableData);
        });
    });
    return promise;
  }
  
}