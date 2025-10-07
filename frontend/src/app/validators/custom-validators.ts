import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  /**
   * Validator to ensure a password contains at least one special character.
   */
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      // Use a regular expression to check for at least one special character
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
      return !hasSpecialChar ? { passwordStrength: true } : null;
    };
  }

  /**
   * Validator to ensure the input is a valid 10-digit phone number.
   */
  static phoneFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      // Use a regular expression to check for exactly 10 digits
      const isPhoneValid = /^\d{10}$/.test(value);
      return !isPhoneValid ? { phoneFormat: true } : null;
    };
  }
  
  /**
   * Validator to ensure a date is not in the future.
   */
  static noFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      // Get today's date and set the time to the end of the day for accurate comparison
      const today = new Date();
      today.setHours(23, 59, 59, 999); 
      
      return selectedDate > today ? { noFutureDate: true } : null;
    };
  }

  /**
   * Cross-field validator to ensure the end date is after the start date.
   * This validator must be applied to the FormGroup.
   * @param startDateControlName The name of the start date form control.
   * @param endDateControlName The name of the end date form control.
   */
  static dateRange(startDateControlName: string, endDateControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const startDateControl = formGroup.get(startDateControlName);
      const endDateControl = formGroup.get(endDateControlName);

      if (!startDateControl || !endDateControl || !startDateControl.value || !endDateControl.value) {
        return null; // Don't validate if controls or values don't exist
      }
      
      const startDate = new Date(startDateControl.value);
      const endDate = new Date(endDateControl.value);
      
      // If the end date is before the start date, set an error on the end date control
      if (endDate < startDate) {
        endDateControl.setErrors({ dateRange: true });
        return { dateRange: true }; // Also return error on the group for good measure
      } else {
        // If the end date is valid, clear a previously set dateRange error
        if (endDateControl.hasError('dateRange')) {
          endDateControl.setErrors(null);
        }
        return null;
      }
    };
  }
}