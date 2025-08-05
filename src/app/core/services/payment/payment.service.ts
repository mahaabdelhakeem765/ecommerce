import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  myToken = localStorage.getItem('myToken') !

  constructor(private httpClient:HttpClient) { }

  // Checkout session
  ckeckoutSession(cartId: string , shipingData: object): Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}` , 
      {
        "shippingAddress": shipingData
      },
      {
        headers: {
          token: this.myToken
        }
      }
    )
  }

  getUserOrders(userId: string): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`)
  }
  // Create Cash Order
  createCashOrder(cartId: string , shipingData: object): Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}`, 
      {
        "shippingAddress": shipingData
      },
      {
        headers: {
          token: this.myToken
        }
      }
    )
  }
}
