import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CouncilDialog } from '../component/common-components/dialog/create-dialog-util';
import { ProfileFormMessages } from '../constant/Messages';
import { ResourceURL } from '../constant/ResourceURL';
import { SearchFormGroup } from '../formGroups/FormListGroup';
import { ProfileFormGroup } from '../formGroups/ProfileFormGroup';
import { BaseResponse } from '../model/base-response.model';
import { AreaDistrictsModel, ProfileInfo } from '../model/user-registration.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private councilDialog: CouncilDialog) { }

  public getDistricts(): Observable<AreaDistrictsModel[]> {
    return this.http.get<BaseResponse>(ResourceURL.HOST + ResourceURL.AREA_DISTRICTS)
      .pipe(
        map(data => {
          let areaDistricts = data.result as AreaDistrictsModel[];
          return areaDistricts;
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

  public getUserDetails(userId) {
    return this.http.get<BaseResponse>(ResourceURL.HOST + ResourceURL.USER_ID.replace("{userId}", userId))
      .pipe(
        map(data => {
          let profileInfo = null;
          if (data.result) {
            profileInfo = data.result as ProfileInfo;
          }
          return profileInfo;
        }),
        catchError(error => {
          if (error.status != '500' && error.error) {
            this.councilDialog.openDialog(ProfileFormMessages.RETRIEVAL_FAILED, JSON.parse(error.error).errorMessages);
          }
          return throwError(error);
        })
      );
  }

  public searchUsers(searchFormGroup: SearchFormGroup) {
    let body = JSON.stringify(searchFormGroup.form.getRawValue());
    return this.http.post<BaseResponse>(ResourceURL.HOST + ResourceURL.USER_SEARCH, body)
      .pipe( 
        map(data => {
          let tableData = new Array<ProfileInfo>();
          for (let obj of data.result) {
            let data = new ProfileInfo();
            data.userId = obj.userId;
            data.district = obj.district;
            data.institutionName = obj.institutionName;
            data.surname = obj.surname;
            data.givenName = obj.givenName;
            data.middleInitial = obj.middleInitial;
            data.mobileNumber = obj.mobileNumber;
            data.emailAddress = obj.emailAddress;
            tableData.push(data);
          }
          if (tableData.length < 1) {
            tableData.push(new ProfileInfo());
          }
          return tableData;
        })
      );
  }

  public updateUser(profileForm: ProfileFormGroup) {
    let body = JSON.stringify(profileForm.form.getRawValue());
    return this.http.put<BaseResponse>(ResourceURL.HOST + ResourceURL.USER_UPDATE, body)
      .pipe(
        map(data => {
          let profileInfo = null;
          if (data.result) {
            profileInfo = data.result as ProfileInfo;
          }
          return profileInfo;
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
