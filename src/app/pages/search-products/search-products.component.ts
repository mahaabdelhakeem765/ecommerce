import { IProduct } from './../../shared/interfaces/iproduct';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/product/products.service';
import { HeaderComponent } from '../../shared/components/business/header/header.component';
import { CardComponent } from '../../shared/components/business/card/card.component';

@Component({
  selector: 'app-search-products',
  imports: [HeaderComponent, CardComponent , RouterLink],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css'
})
export class SearchProductsComponent implements OnInit{

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  searchId: WritableSignal<string> = signal('');
  productSearchList: WritableSignal<IProduct[]> = signal([]);
  title: WritableSignal<string> = signal('');


  ngOnInit(): void {
    this.getId()
  }


  getId(): void{
    this.activatedRoute.paramMap.subscribe({
      next: (res)=>{
        // console.log(res.get('id'));
        // this.searchId.set(res.get('id')!)
        const id = res.get('id');
        if (id) {
          this.searchId.set(id);
          this.getSearchProducts(id);  // Fetch products after getting ID
        }
      }
    })
  }
  
  getSearchProducts(id: string): void {
    // 1- fetch products by brandId
    this.productsService.getProducts(undefined, undefined, undefined, undefined, id).subscribe({
      next: (res) => {
        if (res.data?.length > 0) {
          console.log(res);
          this.productSearchList.set(res.data);
           this.title.set(res.data[0]?.brand?.name || '');
        } else {
          // 2- fetch products by categoryId
          this.productsService.getProducts(undefined, undefined, undefined, id).subscribe({
            next: (res2) => {
              console.log(res2);
              this.productSearchList.set(res2.data);
              this.title.set(res2.data[0]?.category?.name || '');
            },
            error: (err2) => {
              console.error('Error fetching by categoryId', err2);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error fetching by brandId', err);
      }
    });
  }


}
