import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from "../../shared/components/business/header/header.component";
import { ProductsService } from '../../core/services/product/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CardComponent } from '../../shared/components/business/card/card.component';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search.pipe';


@Component({
  selector: 'app-products',
  imports: [HeaderComponent , CardComponent , FormsModule , SearchPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{

  private readonly flowbiteService = inject(FlowbiteService);
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  productsList : WritableSignal<IProduct[]> = signal([]);
  searchItems: WritableSignal<string> = signal('');
  gridCols = 3; // default
  currentPage = signal(1);
  totalRecords = signal(0);
  itemsPerPage = signal(10);
  sortOption = signal('price'); // default sort (low to high)
  isLoading = signal(false);
  isLoadingMore = signal(false);

  // constructor(private flowbiteService: FlowbiteService) {}

   ngOnInit(): void {
    this.useFlowbite()
    // this.getAllProducts()
    // this.loadProducts(false);
    this.saveSortInUrl()
  }

  // getAllProducts(): void{
  //   this.productsService.getProducts().subscribe({
  //     next: (res)=>{
  //       console.log(res);
  //       this.productsList.set(res.data)
  //     },
  //     error: (err)=>{
  //       console.log(err);
  //     }
  //   })
  // }

  // updateUrl -> save sort
  saveSortInUrl(): void{
    // Load initial state from URL
    this.activatedRoute.queryParams.subscribe(params => {
      const sort = params['sort'] || 'price';
      this.sortOption.set(sort);
      this.loadProducts(false);
    });
  }

  loadProducts(loadMore: boolean = false): void {
    if (loadMore) {
      this.isLoadingMore.set(true);
      this.currentPage.update(page => page + 1);
    } else {
      this.isLoading.set(true);
      this.currentPage.set(1);
    }

    // Update URL with current sort option
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { sort: this.sortOption() },
      queryParamsHandling: 'merge'
    });

    this.productsService.getProducts(this.sortOption(), this.currentPage(), this.itemsPerPage()
    ).subscribe({
      next: (res) => {
        if (loadMore) {
          this.productsList.update(products => [...products, ...res.data]);
        } else {
          this.productsList.set(res.data);
        }
        
        this.totalRecords.set(res.results);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      }
    });
  }

  // loadProducts(loadMore: boolean = false): void {
  //   if (loadMore) {
  //     this.isLoadingMore.set(true);
  //     this.currentPage.update(page => page + 1);
  //   } else {
  //     this.isLoading.set(true);
  //     this.currentPage.set(1);
  //   }

  //   this.productsService.getProducts(
  //     this.sortOption(),
  //     this.currentPage(),
  //     this.itemsPerPage()
  //   ).subscribe({
  //     next: (res) => {
  //       if (loadMore) {
  //         this.productsList.update(products => [...products, ...res.data]);
  //       } else {
  //         this.productsList.set(res.data);
  //       }
        
  //       this.totalRecords.set(res.results);
  //       this.isLoading.set(false);
  //       this.isLoadingMore.set(false);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.isLoading.set(false);
  //       this.isLoadingMore.set(false);
  //     }
  //   });
  // }

  onSortChange(sortValue: string): void {
    this.sortOption.set(sortValue);
    this.loadProducts(false); // Reset with new sorting
  }

  loadMore(): void {
    if (!this.isEndOfProducts()) {
      this.loadProducts(true);
    }
  }

  isEndOfProducts(): boolean {
    return this.productsList().length >= this.totalRecords();
  }


  useFlowbite(): void{
    this.flowbiteService.loadFlowbite((_flowbite) => {
      initFlowbite();
    });
  }

}
