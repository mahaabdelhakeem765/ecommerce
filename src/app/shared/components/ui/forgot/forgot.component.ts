import { Component, inject, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { ForgotService } from '../../../../core/services/forgot/forgot.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../business/header/header.component';
import { ErrorMsgComponent } from '../../business/error-msg/error-msg.component';

@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule, HeaderComponent, ErrorMsgComponent],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent implements OnInit{
  
  private readonly forgotService = inject(ForgotService);
  private readonly router = inject(Router);

  forgetSuccessMsg: string = '';
  forgetErrorMsg: string = '';
  resetCodeSuccessMsg: string = '';
  resetCodeErrorMsg: string = '';
  resetPasswordMsg: string = '';
  isLoading: boolean = false;

  step: number = 1;

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  })
  verifyResetCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required])
  })
  resetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-z][a-z0-9]{6,}$/)])
  })

  ngOnInit(): void {
    this.clearErrorOnEmailChange();
    this.clearErrorOnResetCodeChange();
  }

  forgetPass(): void{
    if(this.forgotPasswordForm.valid){
      let emailValue = this.forgotPasswordForm.get('email')?.value;
      this.resetPasswordForm.get('email')?.patchValue(emailValue);
      this.isLoading = true;
      this.forgotService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (res)=>{
          console.log(res);
          this.isLoading = false
          this.forgetErrorMsg = ''
          this.forgetSuccessMsg = res.message
          setTimeout(()=>{
            if(res.statusMsg == 'success'){
              this.step = 2
            }
          },1500)
          
        },
        error: (err)=>{
          console.log(err.error.message);
          this.isLoading = false
          this.forgetErrorMsg = err.error.message
        }
      })
    }else{
      this.forgotPasswordForm.markAllAsTouched()
    }
  }
  verfiyCode(): void{
    if(this.verifyResetCodeForm.valid){
      this.isLoading = true;
      this.forgotService.verfiyResetCode(this.verifyResetCodeForm.value).subscribe({
        next: (res)=>{
          console.log(res);
          this.isLoading = false
          this.resetCodeErrorMsg = ''
          this.resetCodeSuccessMsg = res.status
          setTimeout(()=>{
            if(res.status == 'Success'){
              this.step = 3
            }
          },1500)
          
        },
        error: (err)=>{
          console.log(err.error.message);
          this.isLoading = false
          this.resetCodeErrorMsg = err.error.message
        }
      })
    }else{
      this.verifyResetCodeForm.markAllAsTouched()
    }
  }
  resetPass(): void{
    if(this.resetPasswordForm.valid){
      this.isLoading = true
      this.forgotService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res)=>{
          console.log(res);
          this.isLoading = false
          this.resetPasswordMsg = 'Your password has been reset successfully.'
          setTimeout(()=>{
            this.router.navigate(['/home'])
          },1500)
          
        },
        error: (err)=>{
          console.log(err);
          this.isLoading = false
        }
      })
    }else{
      this.resetPasswordForm.markAllAsTouched()
    }
  }


  clearErrorOnEmailChange(): void {
    this.forgotPasswordForm.get('email')?.valueChanges.subscribe(() => {
      this.forgetErrorMsg = '';
    });
  }
  clearErrorOnResetCodeChange(): void {
    this.verifyResetCodeForm.get('resetCode')?.valueChanges.subscribe(() => {
      this.resetCodeErrorMsg = '';
    });
  }
 


}
