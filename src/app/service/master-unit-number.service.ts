import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CouncilDialog } from '../component/common-components/dialog/create-dialog-util';
import { MasterMessages } from '../constant/Messages';
import { ResourceURL } from '../constant/ResourceURL';
import { BaseResponse } from '../model/base-response.model';
import { UnitNumberModel } from '../model/entities.model';
import { UnitNumberSearchResult } from '../model/search-form.model';

@Injectable({
  providedIn: 'root'
})
export class MasterUnitNumberService {

  constructor(private http: HttpClient,
    private councilDialog: CouncilDialog) { }

  public getUnitNumbersByInstitutionId(institutionId): Observable<UnitNumberModel[]> {
    return this.http.get<BaseResponse>(ResourceURL.HOST + 
      ResourceURL.UNIT_NUMBER_INSTITUTION.replace("{institutionId}", institutionId))
      .pipe(
        map(data => {
          return data.result;
        })
      );
  }

  public searchUnitNumbers(institutionId): Observable<UnitNumberSearchResult> {
    return this.http.get<BaseResponse>(ResourceURL.HOST + 
      ResourceURL.UNIT_NUMBER_SEARCH.replace("{institutionId}", institutionId))
      .pipe(
        map(data => {
          return data.result;
        })
      );
  }

  public createNewUnitNumber(unitNumber: UnitNumberModel) {
    let body = JSON.stringify(unitNumber);
    return this.http.post<BaseResponse>(ResourceURL.HOST + ResourceURL.UNIT_NUMBER_NEW, body)
      .pipe(
        map(data => {
          return data.result;
        }),
        catchError(error => {
          if (error.status != '500' && error.error) {
            this.councilDialog.openDialog(MasterMessages.UNIT_NO_PROCESS_FAILED, JSON.parse(error.error).errorMessages);
          }
          return throwError(error);
        })
      );
  }

  public updateUnitNumber(unitNumbers: UnitNumberModel[]) {
    let body = JSON.stringify(unitNumbers);
    return this.http.put<BaseResponse>(ResourceURL.HOST + ResourceURL.UNIT_NUMBER_UPDATE, body)
      .pipe(
        map(data => {
          return data.result;
        }),
        catchError(error => {
          if (error.status != '500' && error.error) {
            this.councilDialog.openDialog(MasterMessages.UNIT_NO_PROCESS_FAILED, JSON.parse(error.error).errorMessages);
          }
          return throwError(error);
        })
      );
  }

}
