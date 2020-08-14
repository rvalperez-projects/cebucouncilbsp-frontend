import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ProfileErrorMessages } from '../constant/Messages';

@Injectable({
  providedIn: 'root'
})
export class ProfileFormGroup {

  private _profileForm: FormGroup;

  constructor(private formBuild: FormBuilder) {
    this.createForm();
  }

  get form(): FormGroup {
    return this._profileForm;
  }
  get username(): FormControl {
    return this._profileForm.controls['username'] as FormControl;
  }
  get password(): FormControl {
    return this._profileForm.controls['password'] as FormControl;
  }
  get confirmPassword(): FormControl {
    return this._profileForm.controls['confirmPassword'] as FormControl;
  }
  get surname(): FormControl {
    return this._profileForm.controls['surname'] as FormControl;
  }
  get givenName(): FormControl {
    return this._profileForm.controls['givenName'] as FormControl;
  }
  get mobileNumber(): FormControl {
    return this._profileForm.controls['mobileNumber'] as FormControl;
  }
  get email(): FormControl {
    return this._profileForm.controls['email'] as FormControl;
  }
  get institution(): FormControl {
    return this._profileForm.controls['institution'] as FormControl;
  }
  get category(): FormControl {
    return this._profileForm.controls['category'] as FormControl;
  }
  get district(): FormControl {
    return this._profileForm.controls['district'] as FormControl;
  }
  get area(): FormControl {
    return this._profileForm.controls['area'] as FormControl;
  }

  private createForm() {
    this._profileForm = this.formBuild.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      givenName: [null, [Validators.required]],
      middleInitial: [null],
      mobileNumber: [null],
      email: [null, [Validators.required, Validators.email]],
      institution: [null, [Validators.required]],
      category: [null, [Validators.required]],
      district: [null, [Validators.required]],
      area: [{value: null, disabled: true}, [Validators.required]]
    });
  }
  
  getErrorMessage() {

    if (this.username.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.password.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.confirmPassword.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.surname.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.username.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.givenName.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.mobileNumber.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.email.hasError('email') && !this.email.hasError('required')) {
      return ProfileErrorMessages.INVALID_EMAIL_FORMAT;
    }
    if (this.email.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.institution.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.category.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.district.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    if (this.area.hasError('required')) {
      return ProfileErrorMessages.REQUIRED;
    }
    return '';
  }
}