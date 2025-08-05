import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/product/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategory } from '../../shared/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/business/card/card.component';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, RouterLink, SearchPipe, FormsModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly brandsService = inject(BrandsService);

  products: IProduct[] = [];
  categories: Icategory[] = [];
  brandsList: WritableSignal<IBrand[]> = signal([]);

  // searchItems: string = '';
  searchItems: WritableSignal<string> = signal('');
  // categories slider
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1200: {
        items: 7
      }
    },
    nav: true
  }

  // main slider
  mainCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true
  }

  ngOnInit(): void {
    this.callGetProducts();
    this.callGetCategories();
    this.getBrands()
  }

  callGetProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        // console.log(res.data);
        // console.log(this.products);
        this.products = res.data;
      },
      error: (err) => {
        console.log(err);
      },
      // complete: ()=>{
      //   console.log("donnnnnnnnnnnne");

      // }
    });
  }
  callGetCategories(): void {
    this.categoriesService.getAllCtegories().subscribe({
      next: (res) => {
        // console.log(res.data);
        this.categories = res.data
        // console.log(this.categories);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  
  getBrands(): void{
    this.brandsService.getAllBrands().subscribe({
      next: (res)=>{
        // console.log(res.data);
        this.brandsList.set(res.data)
      }
    })
  }

  
  
}
