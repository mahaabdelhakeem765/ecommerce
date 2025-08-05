import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  const ID = inject(PLATFORM_ID);

  if(isPlatformBrowser(ID)){
    if(localStorage.getItem('myToken') !== null){
      if(req.url.includes('cart') || req.url.includes("orders") || req.url.includes('wishlist')){}
        req = req.clone({
        setHeaders: {
          token: localStorage.getItem('myToken')!
        }
      })
    }
  }

  return next(req);
};
