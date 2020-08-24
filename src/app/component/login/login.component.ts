import { Component, OnInit } from '@angular/core';
import { LoginFormGroup } from '../../formGroups/LoginFormGroup';
import { LoginErrorMessages } from '../../constant/Messages';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:  [ LoginFormGroup, AuthService ]
})
export class LoginComponent implements OnInit {

  // Error Messages
  errorMessages: Array<string>;

  // Progress Bar
  loading: boolean;

  constructor(
    private service: AuthService,
    public loginFormGroup: LoginFormGroup
  ) { 
    this.errorMessages = new Array<string>();
  }

  ngOnInit(): void {
  }

  login() {
    if (this.hasValidationError()) {
      console.error("Validation Error");
      return;
    }
    this.loading = true;
    this.service.login(this.loginFormGroup)
      .then(() => this.loading = false);
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

}
