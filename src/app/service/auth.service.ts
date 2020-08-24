import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ResourceURL } from '../constant/ResourceURL';
import { SessionConstant } from '../constant/Constants';
import { LoginErrorMessages } from '../constant/Messages';
import { LoginFormGroup } from '../formGroups/LoginFormGroup';
import { CouncilDialog } from '../component/dialog/create-dialog-util';

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
    // const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' };
    let promise = new Promise((resolve, reject) => {
      let body = {
        username : loginFormGroup.username.value,
        password : loginFormGroup.password.value
      };

      this.http.post<string>(ResourceURL.HOST + ResourceURL.LOGIN, 
        JSON.stringify(body))
        .toPromise()
        .then(
          data => {
            // Add to local storage
            this.decodeJwtToken(data);    

            // Navigate to Home
            this.router.navigateByUrl('/forms');
            resolve();
          },
          error => {
            if (error.error) {
              let errorResponse = JSON.parse(error.error);
              this.councilDialog.openDialog(LoginErrorMessages.INCORRECT_DATA, errorResponse.errorMessages);
            }
            reject();
          }
        );
    });
    return promise;
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
      window.sessionStorage.setItem(SessionConstant.USER_INSTITUTION_ID_KEY, decoded.userDetails.institutionId);
      window.sessionStorage.setItem(SessionConstant.USER_ROLE_CODE_KEY, decoded.userDetails.roleCode);
    }
  }
}