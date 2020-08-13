import {FormControl, Validators} from '@angular/forms';

export class ProfileValidator {

  ProfileValidator() {
    
  }

  usernameFormControl = new FormControl('', [
    Validators.required
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);
  confirmPasswordFormControl = new FormControl('', [
    Validators.required
  ]);
  surnameFormControl = new FormControl('', [
    Validators.required
  ]);
  givenNameFormControl = new FormControl('', [
    Validators.required
  ]);
  mobileNumberFormControl = new FormControl('', [
    
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  institutionFormControl = new FormControl('', [
    Validators.required
  ]);
  categoryFormControl = new FormControl('', [
    Validators.required
  ]);
  districtFormControl = new FormControl('', [
    Validators.required
  ]);
  areaFormControl = new FormControl('', [
    Validators.required
  ]);
  
  getErrorMessage() {
    if (this.usernameFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.passwordFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.confirmPasswordFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.surnameFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.usernameFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.givenNameFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.mobileNumberFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.emailFormControl.hasError('email') && !this.emailFormControl.hasError('required')) {
      return 'Please enter a valid email address';
    }
    if (this.emailFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.institutionFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.categoryFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.districtFormControl.hasError('required')) {
      return 'Required Field';
    }
    if (this.areaFormControl.hasError('required')) {
      return 'Required Field';
    }
    return '';
  }
}