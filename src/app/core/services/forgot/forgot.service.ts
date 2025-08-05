import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class ForgotService {

  constructor(private httpClient:HttpClient) { }

  forgotPassword(data: string): Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords` , data)
  }
  verfiyResetCode(data: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode` , data)
  }
  resetPassword(data: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword` , data)
  }
}
