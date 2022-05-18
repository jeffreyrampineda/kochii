import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/** Validator for comparing password and passwordre */
export function PasswordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const password = control.get('password').value;
        const passwordre = control.get('passwordre').value;

        if (password !== passwordre) {
            control.get('passwordre').setErrors({ noMatch: true });
            return ({ noMatch: true });
        }
        control.get('passwordre').setErrors(null);
        return null;
    };
}
