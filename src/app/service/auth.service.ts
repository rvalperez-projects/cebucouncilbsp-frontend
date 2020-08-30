import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { CouncilDialog } from '../component/common-components/dialog/create-dialog-util';
import { SessionConstant } from '../constant/Constants';
import { LoginErrorMessages } from '../constant/Messages';
import { ResourceURL } from '../constant/ResourceURL';
import { LoginFormGroup } from '../formGroups/LoginFormGroup';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private councilDialog: CouncilDialog
  ) { 
  }
  
  public login(loginFormGroup: LoginFormGroup) {
    let body = JSON.stringify(loginFormGroup.form.getRawValue());

    return this.http.post<string>(ResourceURL.HOST + ResourceURL.LOGIN, body)
      .pipe(
        map(data => {
          // Add to local storage
          this.decodeJwtToken(data);    

          // Navigate to Home
          this.router.navigateByUrl('/home');
        }),
        catchError(error => {
          if (error.error) {
            let errorResponse = JSON.parse(error.error);
            this.councilDialog.openDialog(LoginErrorMessages.INCORRECT_DATA, errorResponse.errorMessages);
          }
          throw error;
        })
      );
  }
  
  public logout() {
    // Remove data in storage
    window.sessionStorage.clear();

    // Navigate back to login
    this.router.navigateByUrl('');
  }

  public openDialog(title: string, messages: Array<string>) {
    if (messages.length > 0) {
      this.councilDialog.openDialog(title, messages);
    }
  }

  private decodeJwtToken(token: string) {
    let decoded = JSON.parse(atob(token.split('.')[1]));

    // Add to local storage
    if (decoded) {
      window.sessionStorage.setItem(SessionConstant.LOGIN_TOKEN_KEY, token);
      window.sessionStorage.setItem(SessionConstant.USER_ID_KEY, decoded.userDetails.userId);
      window.sessionStorage.setItem(SessionConstant.USER_GIVEN_NAME, decoded.userDetails.givenName);
      window.sessionStorage.setItem(SessionConstant.USER_INSTITUTION_ID_KEY, decoded.userDetails.institutionId);
      window.sessionStorage.setItem(SessionConstant.USER_ROLE_CODE_KEY, decoded.userDetails.roleCode);
    }
  }
}