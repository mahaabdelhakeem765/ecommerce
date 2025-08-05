import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) { }

  getAllCtegories(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }
  getSpecificCategory(id:string): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories/${id}`)
  }
  
  // Get All SubCategories On Category
  // https://ecommerce.routemisr.com/api/v1/categories/6407ea3d5bbc6e43516931df/subcategories
  getAllSubCategoriesOnCategory(categoryId: string): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories/${categoryId}/subcategories`);
  }
}
