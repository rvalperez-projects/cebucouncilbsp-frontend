import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionConstant } from '../constant/Constants';
import { EnumUtil, Roles } from '../constant/Enums';
import { ResourceURL } from '../constant/ResourceURL';
import { BaseResponse } from '../model/base-response.model';
import { InstitutionModel } from '../model/entities.model';
import { SearchFormModel } from '../model/search-form.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private role: Roles;
  private institutionId: string;
  private boxValues: Map<string, Map<string, Map<number, string>>>;

  constructor(
    private http: HttpClient
   ) { 
     this.boxValues = new Map<string, Map<string, Map<number, string>>>();
  }

  public initializeSearchBoxes(): Observable<any> {

    // Get info from session
    let roleCode = window.sessionStorage.getItem(SessionConstant.USER_ROLE_CODE_KEY);
    this.role = EnumUtil.getEnumValueByValue(Roles, roleCode);
    this.institutionId = window.sessionStorage.getItem(SessionConstant.USER_INSTITUTION_ID_KEY);

    // Determine API to call
    switch(this.role) {
      case Roles.GENERAL_USER: 
        return this.populateInstitutionBox().pipe(
          map((institution: InstitutionModel) => {
            return institution;
          })
        );
      case Roles.COUNCIL:
      case Roles.ADMIN:
        return this.populateAreaDistrictInstitutionBoxes().pipe(
          map((result: Map<string, Map<string, Map<number, string>>>) => {
            this.boxValues = result;
            return result;
          })
        );
    }
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

  private populateInstitutionBox(): Observable<InstitutionModel> {
    return this.http.get<BaseResponse>(ResourceURL.HOST + 
      ResourceURL.INSTITUTION_ID.replace('{institutionId}', this.institutionId))
      .pipe(
        map(data => {
          return data.result;
        })
      );
  }

  private populateAreaDistrictInstitutionBoxes(): Observable<Map<string, Map<string, Map<number, string>>>> {
      // Call API
    return this.http.get<BaseResponse>(ResourceURL.HOST + ResourceURL.AREA_DISTRICTS_INSTITUTIONS)
      .pipe(
        map((data) => {
          return data.result;
        })
      );
  }
  
}