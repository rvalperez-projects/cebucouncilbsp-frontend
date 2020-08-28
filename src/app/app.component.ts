import { Component, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { AuthService } from '../app/service/auth.service';
import { SessionConstant } from './constant/Enums';
import { MatSpinnerOverlayComponent } from '../app/utils/mat-spinner-overlay/mat-spinner-overlay.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked  {

  constructor(
    private authService: AuthService,
    public spinner: MatSpinnerOverlayComponent,
    private cdRef: ChangeDetectorRef) {
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  logout() {
    this.authService.logout();
  }

  get isLoggedIn(): boolean {
    return window.sessionStorage[SessionConstant.LOGIN_TOKEN_KEY];
  }
}
