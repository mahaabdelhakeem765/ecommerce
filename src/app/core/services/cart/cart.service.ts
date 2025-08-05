import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  myToken = localStorage.getItem('myToken') !
  cartNumber: WritableSignal<number> = signal(0)
  // cartNumber: BehaviorSubject<number> = new BehaviorSubject(0)

  constructor(private httpClient:HttpClient) { }

  addProductToCart(id: string):  Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`,
      {
        "productId": id
      },
    )
  }

  getLoggedUserCart(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart` )
  }

  removeSpecificCartItem(productId: string): Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${productId}`)
  }

  updateCartProductQuantity(prosuctId: string , quantity: number): Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${prosuctId}` , 
      {
        "count": quantity
      },
      {
        headers:{
          token: this.myToken
        }
      }
    )
  }

  clearUserCart(): Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart` )
  }
}
