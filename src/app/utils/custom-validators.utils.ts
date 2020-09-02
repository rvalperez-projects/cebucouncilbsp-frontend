import { AbstractControl } from '@angular/forms';

export function whitespaceOnlyNotAllowed(control: AbstractControl) {
  if (control && control.value && control.value.trim().length == 0) {
    return {'whitespace': 'true'};
  }
  return null;
}