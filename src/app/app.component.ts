import { AfterContentChecked, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../app/service/auth.service';
import { MatSpinnerOverlayComponent } from '../app/utils/mat-spinner-overlay/mat-spinner-overlay.component';
import { SessionConstant } from './constant/Constants';
import { Roles } from './constant/Enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked  {

  // Toolbar
  userId: number;
  private loggedInUser: string;

  isProfileClicked: boolean;
  isNotGeneralUser: boolean;

  constructor(
    private authService: AuthService,
    public spinner: MatSpinnerOverlayComponent,
    private cdRef: ChangeDetectorRef) {
      this.isNotGeneralUser = false;
  }

  initLoggedInUser() {
    this.userId = window.sessionStorage[SessionConstant.USER_ID_KEY];
    this.loggedInUser = "Sctr. " + window.sessionStorage[SessionConstant.USER_GIVEN_NAME];
    this.isNotGeneralUser = window.sessionStorage[SessionConstant.USER_ROLE_CODE_KEY] != Roles.GENERAL_USER;
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  openProfile() {
    this.isProfileClicked = true;
    this.cdRef.detectChanges();
  }

  processLogout() {
    this.authService.logout();
  }

  get isLoggedIn(): boolean {
    return window.sessionStorage[SessionConstant.LOGIN_TOKEN_KEY];
  }
}
