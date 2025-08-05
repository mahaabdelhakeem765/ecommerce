import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
// import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor( private httpClient:HttpClient ) { }

  getProducts(sort?: string , page?:number , limit?: number , categoryId?: string, brandId?: string): Observable<any>{
    let params = new HttpParams
     if (sort) {
      params = params.set('sort', sort); 
    }
    if (page) {
      params = params.set('page', page.toString());
    }
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    if (categoryId) {
      params = params.set('category[in]', categoryId);
    }
    if (brandId) {
      params = params.set('brand', brandId);
    }
    
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products` , {params})
  }

  getSpesficProduct(id:string): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${id}`)
  }

  // getRelatedProduct(subcatId: string): Observable<any>{
  //   return this.httpClient.get(`${environment.baseUrl}/api/v1/subcategories/${subcatId}`)
  // }
  getProductsBySubcategoryId(subcatId: string): Observable<any> {
  return this.httpClient.get(`${environment.baseUrl}/api/v1/products?subcategory[in]=${subcatId}`);
}

}
