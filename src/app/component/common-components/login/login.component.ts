import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { LoginErrorMessages } from '../../../constant/Messages';
import { LoginFormGroup } from '../../../formGroups/LoginFormGroup';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:  [ LoginFormGroup, AuthService ]
})
export class LoginComponent implements OnInit  {

  // Error Messages
  errorMessages: Array<string>;

  isSignUpClicked: boolean;

  constructor(
    private service: AuthService,
    public loginFormGroup: LoginFormGroup,
    private cdRef: ChangeDetectorRef,
    private header: AppComponent
  ) { 
    this.errorMessages = new Array<string>();
  }

  ngOnInit(): void {
    this.isSignUpClicked = false;
  }

  login() {
    if (this.hasValidationError()) {
      console.error("Validation Error");
      return;
    }
    this.service.login(this.loginFormGroup)
      .subscribe(() => {
        this.header.initLoggedInUser();
    });
  }

  private hasValidationError(): boolean {
    this.errorMessages = [];
    let result = this.loginFormGroup.getErrorMessage();
    if (result) {
      this.errorMessages.push(result);
    }

    if (this.errorMessages.length > 0) { 
      this.service.openDialog(LoginErrorMessages.INCOMPLETE_DATA, this.errorMessages);
      return true;
    }
    return false;
  }

  openSignUp() {
    this.isSignUpClicked = true;
    this.cdRef.detectChanges();
  }

}
