import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) { return null; }
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
      return !hasSpecialChar ? { passwordStrength: true } : null;
    };
  }

  static phoneFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) { return null; }
      const isPhoneValid = /^\d{10}$/.test(value);
      return !isPhoneValid ? { phoneFormat: true } : null;
    };
  }

  static lettersOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) { return null; }
        const areLettersOnly = /^[a-zA-Z\s]*$/.test(value);
        return !areLettersOnly ? { lettersOnly: true } : null;
    };
  }
  
  static noFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); 
      return selectedDate > today ? { noFutureDate: true } : null;
    };
  }

  static dateAfter(startDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      if (!formGroup) { return null; }

      const startDateControl = formGroup.get(startDateControlName);
      if (!startDateControl || !startDateControl.value || !control.value) {
        return null;
      }

      const startDate = new Date(startDateControl.value);
      const endDate = new Date(control.value);

      return endDate < startDate ? { dateAfter: true } : null;
    };
  }
}