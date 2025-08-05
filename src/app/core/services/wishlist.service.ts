import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  
  myToken = localStorage.getItem('myToken') !
  wishlistNumber: WritableSignal<number> = signal(0)

  constructor(private httpClient:HttpClient) { }

  addProductToWishlist(id: string): Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, 
      {
        "productId": id
      },
    )
  }

  removeProductFromWishlist(productId: string): Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${productId}`,
    )
  }

  getLoggedUserWishlist(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`, 
    )
  }
  
}

