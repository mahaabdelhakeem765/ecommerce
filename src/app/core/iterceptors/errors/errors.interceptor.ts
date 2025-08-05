import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {

  const toastrService =inject(ToastrService);

  return next(req).pipe( catchError( (err)=>{
    console.log(err);   //logic
    toastrService.error(err.error.message , 'Opps error!' , {toastClass: 'ngx-toastr error-toast'});
    return throwError( ()=> err )
    
  } ) );
};
