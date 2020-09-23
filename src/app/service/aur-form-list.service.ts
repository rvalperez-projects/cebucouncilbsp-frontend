import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { EnumUtil, FormStatus, Roles } from '../constant/Enums';
import { ResourceURL } from '../constant/ResourceURL';
import { SearchFormGroup } from '../formGroups/FormListGroup';
import { BaseResponse } from '../model/base-response.model';
import { FormListSearchResultsModel } from '../model/form-list.model';

@Injectable({
  providedIn: 'root'
})
export class AURFormListService {

  private role: Roles;
  private institutionId: string;
  private boxValues: Map<string, Map<string, Map<number, string>>>;

  constructor(
    private http: HttpClient
   ) { 
     this.boxValues = new Map<string, Map<string, Map<number, string>>>();
  }

  public searchAURForm(searchFormGroup: SearchFormGroup) {
    let body = JSON.stringify(searchFormGroup.form.getRawValue());
    return this.http.post<BaseResponse>(ResourceURL.HOST + ResourceURL.FORM_SEARCH, body)
      .pipe( 
        map(data => {
          let tableData = new Array<FormListSearchResultsModel>();
          for (let obj of data.result) {
            let data = new FormListSearchResultsModel();
            data.formId = obj.formId;
            data.aurNumber = obj.unitRegistrationNo;
            data.unitNumber = obj.unitNumber;
            data.institution = obj.institutionName;
            data.district = obj.district;
            data.dateApplied = obj.dateApplied;
            data.lastUpdatedDate = obj.updatedDateTime;
            data.status = EnumUtil.getEnumTextByValue(FormStatus, obj.statusCode);
            tableData.push(data);
          }
          if (tableData.length < 1) {
            tableData.push(new FormListSearchResultsModel());
          }
          return tableData;
        })
      );
  }
  
}