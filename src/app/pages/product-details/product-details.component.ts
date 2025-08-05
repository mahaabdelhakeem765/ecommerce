import { WishlistService } from './../../core/services/wishlist.service';
import { Component, inject, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../../core/services/product/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
// import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { CardComponent } from '../../shared/components/business/card/card.component';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, RouterModule, CarouselModule, CardComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{


  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  
  productId: WritableSignal<string> = signal('');
  productData: WritableSignal<IProduct | null> = signal(null);
  subCatoryId : WritableSignal<string> = signal('');
  relatedProducts = signal<IProduct[]>([]);
  loadingWishlist: WritableSignal<boolean> = signal(false);
  loadingCart: WritableSignal<boolean> = signal(false);

  customOptions: OwlOptions = {
    loop: true,
    margin: 16,
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

  
  selectedImage: string = '';
  quantity: number = 1;

  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    // this.getId()
    // this.getSpeceficProd()
    this.activatedRoute.params.subscribe(params => {
    const id = params['id'];
    if (id) {
      this.getId();
      this.getSpeceficProd();
    }
     this.flowbiteService.loadFlowbite((_flowbite) => {
      initFlowbite();
    });
  });
  }

  getId(): void{
    this.activatedRoute.paramMap.subscribe({
      next: (res)=>{
        // console.log(res.get('id'));
        const id = res.get('id')
        this.productId.set(id!)
        //  console.log('Product ID:', id);
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  addToCart(): void{
    this.loadingCart.set(true);
    this.cartService.addProductToCart(this.productId()).subscribe({
      next: (res)=>{
        console.log(res);
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.toastrService.success(res.message, 'Add to Cart!', 
          {toastClass: 'ngx-toastr custom-gray-toast', 
            progressBar: true ,
            messageClass: 'text-sm'
          });
          this.loadingCart.set(false);
      },
      error: (err) => {
      console.log(err);
      this.loadingCart.set(false);
    }
    })
  }

  addToWishlist(): void{
    this.loadingWishlist.set(true);
    this.wishlistService.addProductToWishlist(this.productId()).subscribe({
      next: (res)=>{
        console.log(res);
        this.wishlistService.wishlistNumber.set(res.data.length);
        this.loadingWishlist.set(false);
      },
      error: (err) => {
      console.log(err);
      this.loadingWishlist.set(false);
    }
    })
  }

  getSpeceficProd(): void{
    this.productsService.getSpesficProduct(this.productId()).subscribe({
      next: (res)=>{
        // const product = res.data;
        this.productData.set(res.data)

        this.selectedImage = this.productData()!.imageCover;
        this.subCatoryId.set(res.data.subcategory[0]._id)
        this.callGetRelatedProduct();
      }
    })
  }

  callGetRelatedProduct(): void {
  const currentProductId = this.productId();

  this.productsService.getProductsBySubcategoryId(this.subCatoryId()).subscribe({
    next: (res) => {
      const allRelated = res.data.filter((prod: IProduct) => prod._id !== currentProductId);
      const randomFour = this.getRandomProducts(allRelated, 4);
      this.relatedProducts.set(randomFour);
    }
  });
}

getRandomProducts(products: IProduct[], count: number): IProduct[] {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

  increase() {
    this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }


  changeImage(step: number): void {
    const images = this.productData()?.images ?? [];
    if (!images.length) return;

    const currentIndex = images.indexOf(this.selectedImage);
    let newIndex = currentIndex + step;

    if (newIndex >= images.length) {
      newIndex = 0;
    }
    if (newIndex < 0) {
      newIndex = images.length - 1;
    }

    this.selectedImage = images[newIndex];
  }
  nextImage(): void {
    this.changeImage(1);
  }

  prevImage(): void {
    this.changeImage(-1);
  }



}
