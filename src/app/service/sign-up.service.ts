import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CouncilDialog } from '../component/common-components/dialog/create-dialog-util';
import { AreaDistrictsInterface } from '../constant/Constants';
import { ProfileFormMessages } from '../constant/Messages';
import { ResourceURL } from '../constant/ResourceURL';
import { ProfileFormGroup } from '../formGroups/ProfileFormGroup';
import { BaseResponse } from '../model/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient,
    private councilDialog: CouncilDialog) { }

  public getDistricts(): Observable<AreaDistrictsInterface[]> {
    return this.http.get<BaseResponse>(ResourceURL.HOST + ResourceURL.AREA_DISTRICTS)
      .pipe(
        map(data => {
          let institutions = data.result as AreaDistrictsInterface[];
          return institutions;
        })
      );
  }

  public registerUser(profileForm: ProfileFormGroup) {
    let body = JSON.stringify(profileForm.form.getRawValue());
    return this.http.post<BaseResponse>(ResourceURL.HOST + ResourceURL.SIGN_UP, body)
      .pipe(
        map(data => {
          return data.result;
        }),
        catchError(error => {
          if (error.status != '500' && error.error) {
            this.councilDialog.openDialog(ProfileFormMessages.SUBMISSION_ERROR, error.error.errorMessages);
          }
          return throwError(error);
        })
      );
  }
}
