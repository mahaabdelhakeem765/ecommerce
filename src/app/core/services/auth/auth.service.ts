import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { jwtDecode } from "jwt-decode";
import { IUserData } from '../../../shared/interfaces/iuser-data';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient , private router:Router) { }

  // userData: IUserData as IUserData;    //error
  // userData: any;


  // userData: IUserData | null = null;
  userData: WritableSignal<IUserData | null> = signal(null);

  
  signUp(data: object): Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, data)
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signin` , data)
  }

  // getUserData(): void{
  //   // console.log(jwtDecode(localStorage.getItem('myToken')!))
  //   this.userData = jwtDecode(localStorage.getItem('myToken')!)
  //   console.log(this.userData);
  // }
  getUserData(): void {
  const token = localStorage.getItem('myToken');
  if (token) {
    const decoded = jwtDecode<IUserData>(token);
    this.userData.set(decoded);  // ✅ keep the signal intact
  }
}

  
  signOut(): void{
    // 1- Remove token from local storage
    localStorage.removeItem('myToken')

    // 2- 
    // this.userData = null
    this.userData.set(null)
    // 3- 
    this.router.navigate(['/login'])
  }

  saveUserData(): void{
    const token = localStorage.getItem('myToken');
  if (token) {
    const decoded = jwtDecode<IUserData>(token);
    this.userData.set(decoded);
    console.log('Decoded user:', this.userData());
  }
  }


  // solve problem whishlist :
  isLoggedIn: WritableSignal<boolean> = signal(!!localStorage.getItem('myToken'));

  setLoggedIn(status: boolean) {
    this.isLoggedIn.set(status);
  }

  getToken(): string | null {
    return localStorage.getItem('myToken');
  }

}
