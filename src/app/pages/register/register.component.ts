import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/business/header/header.component';
import { ErrorMsgComponent } from '../../shared/components/business/error-msg/error-msg.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule , HeaderComponent , ErrorMsgComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z][a-z0-9]{6,}$/),
      ]),
      rePassword: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
    },
    { validators: this.confirmPassword }
  );

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value; //value password
    const rePassword = group.get('rePassword')?.value; //value rePassword

    if (password === rePassword) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      console.log(this.registerForm);
      [];
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res.message);
          this.isLoading = false;
          this.errorMsg = '';
          this.successMsg = res.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (err) => {
          console.log(err.error.message);
          this.isLoading = false;
          this.errorMsg = err.error.message;
        },
      });
    }else{
      this.registerForm.markAllAsTouched();
    }
  }

  /*
  {
  }
  */
}
