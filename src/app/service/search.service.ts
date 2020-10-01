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
    this.institutionId = window.sessionStorage.getItem(SessionConstant.USER_INSTITUTION_ID_KEY);
    let roleCode = window.sessionStorage.getItem(SessionConstant.USER_ROLE_CODE_KEY);

    // If roleCode is not yet set (ex: Sign Up page), allow all results
    if (!roleCode) {
      this.role = Roles.COUNCIL;
    } else {
      this.role = EnumUtil.getEnumValueByValue(Roles, roleCode);
    }

    // Determine API to call
    switch(this.role) {
      case Roles.GENERAL_USER: 
        return this.getInstitution().pipe(
          map((institution: InstitutionModel) => {
            return institution;
          })
        );
      case Roles.COUNCIL:
      case Roles.ADMIN:
        return this.getAreasAndDistricts().pipe(
          map((result: Map<string, Array<string>>) => {            
            for (let area of Object.keys(result)) {
              let districtMap = new Map<string, Map<number, string>>();
              for (let district of result[area]) {
                districtMap.set(district, new Map<number, string>());
              }
              this.boxValues.set(area, districtMap);
            }
            return this.boxValues;
          })
        );
    }
  }

  public populateAreaDistrictBoxes(searchFormModel: SearchFormModel, areaInput: string) {

    if (this.role == Roles.GENERAL_USER) {
      return;
    }

    let areas: Array<string> = [];
    let districts: Array<string> = [];

    for (let area of Array.from(this.boxValues.keys())) {
      areas.push(area);
    }
    for (let district of Array.from(this.boxValues.get(areaInput).keys())) {
      districts.push(district);
    }
    searchFormModel.areaList = areas;
    searchFormModel.districtList = districts;
  }

  public populateInstitutionBoxes(searchFormModel: SearchFormModel, institutions: Map<number, InstitutionModel>) {

    if (this.role == Roles.GENERAL_USER) {
      return;
    }
    let institutionMap = new Map<number, InstitutionModel>();
    for (let institution of institutions.values()) {
      institutionMap.set(institution.institutionId, institution);
    }
    searchFormModel.institutionMap = institutionMap;
  }

  private getInstitution(): Observable<InstitutionModel> {
    return this.http.get<BaseResponse>(ResourceURL.HOST + 
      ResourceURL.INSTITUTION_ID.replace('{institutionId}', this.institutionId))
      .pipe(
        map(data => {
          return data.result;
        })
      );
  }

  public getInstitutionsByAreaAndDistrict(area: string, district: string): Observable<Array<InstitutionModel>> {
    return this.http.get<BaseResponse>(ResourceURL.HOST + 
      ResourceURL.AREA_DISTRICTS_INSTITUTIONS.replace('{area}', area).replace('{district}', district))
      .pipe(
        map(data => {
          return data.result;
        })
      );
  }

  private getAreasAndDistricts(): Observable<Map<string, Array<string>>> {
      // Call API
    return this.http.get<BaseResponse>(ResourceURL.HOST + ResourceURL.AREA_DISTRICTS)
      .pipe(
        map((data) => {
          return data.result;
        })
      );
  }
  
}