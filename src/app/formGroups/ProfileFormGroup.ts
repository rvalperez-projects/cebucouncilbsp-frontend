import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Roles } from '../constant/Enums';
import { ProfileInfo } from '../model/user-registration.model';
import { whitespaceOnlyNotAllowed } from '../utils/custom-validators.utils';

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
  get userId(): FormControl {
    return this._profileForm.controls['userId'] as FormControl;
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
  get middleInitial(): FormControl {
    return this._profileForm.controls['middleInitial'] as FormControl;
  }
  get mobileNumber(): FormControl {
    return this._profileForm.controls['mobileNumber'] as FormControl;
  }
  get emailAddress(): FormControl {
    return this._profileForm.controls['emailAddress'] as FormControl;
  }
  get institutionId(): FormControl {
    return this._profileForm.controls['institutionId'] as FormControl;
  }
  get institutionName(): FormControl {
    return this._profileForm.controls['institutionName'] as FormControl;
  }
  get address(): FormControl {
    return this._profileForm.controls['address'] as FormControl;
  }
  get categoryCode(): FormControl {
    return this._profileForm.controls['categoryCode'] as FormControl;
  }
  get district(): FormControl {
    return this._profileForm.controls['district'] as FormControl;
  }
  get area(): FormControl {
    return this._profileForm.controls['area'] as FormControl;
  }
  get contactNumber(): FormControl {
    return this._profileForm.controls['contactNumber'] as FormControl;
  }

  private createForm() {
    this._profileForm = this.formBuild.group({
      userId: [null],
      username: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8), whitespaceOnlyNotAllowed]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8), whitespaceOnlyNotAllowed]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8), whitespaceOnlyNotAllowed]],
      surname: [null, [Validators.required, whitespaceOnlyNotAllowed]],
      givenName: [null, [Validators.required, whitespaceOnlyNotAllowed]],
      middleInitial: [null, [whitespaceOnlyNotAllowed]],
      mobileNumber: [null, [whitespaceOnlyNotAllowed]],
      emailAddress: [null, [Validators.required, Validators.email, whitespaceOnlyNotAllowed]],
      institutionId: [null],
      institutionName: [null, [Validators.required, whitespaceOnlyNotAllowed]],
      address: [null, [Validators.required, whitespaceOnlyNotAllowed]],
      categoryCode: [null, [Validators.required]],
      district: [null, [Validators.required]],
      area: [null, [Validators.required]],
      contactNumber: [null, [whitespaceOnlyNotAllowed]],
      authorityCode: [Roles.GENERAL_USER]
    });
  }

  public patchValues(profileInfo : ProfileInfo) {
    this._profileForm.patchValue({
      userId: profileInfo.userId,
      username: profileInfo.username,
      password: profileInfo.password,
      confirmPassword: profileInfo.password,
      surname: profileInfo.surname,
      givenName: profileInfo.givenName,
      middleInitial: profileInfo.middleInitial,
      mobileNumber: profileInfo.mobileNumber,
      emailAddress: profileInfo.emailAddress,
      institionId: profileInfo.institutionId,
      institutionName: profileInfo.institutionName,
      address: profileInfo.address,
      categoryCode: profileInfo.categoryCode,
      district: profileInfo.district,
      area: profileInfo.area,
      contactNumber: profileInfo.contactNumber,
      authorityCode: profileInfo.authorityCode
    });
  }
  
  getErrorMessage(errorMessages: Array<string>) {
    let missingFields = new Array<string>();
    for (let item in this._profileForm.controls) {
        let controlErrors: ValidationErrors = this._profileForm.controls[item].errors;
        if (!controlErrors) {
            continue;
        }
        for (let error in controlErrors) {
            missingFields.push(item);
            continue;
        }
    }
    if (missingFields.length > 0) {
        errorMessages.push("Please input correct value of the following fields:\n[" + missingFields.join(", ") + "]");
    }
  }

}