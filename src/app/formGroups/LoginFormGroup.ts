import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginErrorMessages } from '../constant/Messages';

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
            username: [null, [Validators.required]],
            password: [null, [Validators.required]]
        });
    }

    public getErrorMessage(): string {
        if (this.username.hasError('required')) {
            return LoginErrorMessages.REQUIRED;
        }
        if (this.password.hasError('required')) {
            return LoginErrorMessages.REQUIRED;
        }
    }

}