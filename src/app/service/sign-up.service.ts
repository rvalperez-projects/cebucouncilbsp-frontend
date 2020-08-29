import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceURL } from '../constant/ResourceURL';
import { BaseResponse } from '../model/base-response.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AreaDistrictsInterface } from '../constant/Constants';
import { ProfileFormGroup } from '../formGroups/ProfileFormGroup';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

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
        })
      );
  }
}
