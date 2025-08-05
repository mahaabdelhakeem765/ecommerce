import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/business/header/header.component';
import { ErrorMsgComponent } from '../../shared/components/business/error-msg/error-msg.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, HeaderComponent, ErrorMsgComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {


  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z][a-z0-9]{6,}$/),
    ]),
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      console.log(this.loginForm);
      [];
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
          this.errorMsg = '';
          this.successMsg = res.message;

          // 1- save token in localstorage
          localStorage.setItem('myToken' , res.token)

          // 2- decode token
          this.authService.getUserData()

          // 3- navigate home
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (err) => {
          // console.log(err.error.message);
          this.isLoading = false;
          this.errorMsg = err.error.message;
        },
      });
    }else{
      this.loginForm.markAllAsTouched()
    }
  }


}
