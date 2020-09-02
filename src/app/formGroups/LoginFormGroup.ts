import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginErrorMessages } from '../constant/Messages';
import { whitespaceOnlyNotAllowed } from '../utils/custom-validators.utils';

@Injectable({
    providedIn: 'root'
})
export class LoginFormGroup {

    private _loginForm: FormGroup;

    get form(): FormGroup {
        return this._loginForm;
    }
    get username() {
        return this._loginForm.get('username') as FormControl;
    }
    get password() {
        return this._loginForm.get('password') as FormControl;
    }
    constructor(private formBuild: FormBuilder) {
        this.createForm();
    }
    private createForm() {
        this._loginForm = this.formBuild.group({
            username: [null, [Validators.required, whitespaceOnlyNotAllowed]],
            password: [null, [Validators.required, whitespaceOnlyNotAllowed]]
        });
    }

    public getErrorMessage(): string {
        if (this.username.errors) {
            return LoginErrorMessages.REQUIRED;
        }
        if (this.password.errors) {
            return LoginErrorMessages.REQUIRED;
        }
    }

}