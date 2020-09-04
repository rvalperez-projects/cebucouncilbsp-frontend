import { AfterContentChecked, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../app/service/auth.service';
import { MatSpinnerOverlayComponent } from '../app/utils/mat-spinner-overlay/mat-spinner-overlay.component';
import { SessionConstant } from './constant/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked  {

  // Toolbar
  private loggedInUser: string;

  isProfileClicked: boolean;

  constructor(
    private authService: AuthService,
    public spinner: MatSpinnerOverlayComponent,
    private cdRef: ChangeDetectorRef) {
  }

  initLoggedInUser() {
    this.loggedInUser = "Sctr. " + window.sessionStorage[SessionConstant.USER_GIVEN_NAME];
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
