import { Component, inject, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Modal } from 'flowbite';
import type { ModalInterface, ModalOptions } from 'flowbite';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../../../core/services/product/products.service';
import { IProduct } from '../../../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-quick-view',
  imports: [CurrencyPipe , RouterLink ],
  templateUrl: './product-quick-view.component.html',
  styleUrl: './product-quick-view.component.css'
})
export class ProductQuickViewComponent implements OnInit, OnDestroy {

  private readonly productService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService)

  @Input() productId: string = '';
  modal: ModalInterface | null = null;
  product: WritableSignal<IProduct | null> = signal(null);
  selectedImage = signal('');
  quantity = signal(1);
  currentIndex = signal(0);
  allImages: string[] = [];
  loadingCart: WritableSignal<boolean> = signal(false);
  loadingWishlist: WritableSignal<boolean> = signal(false);
  
  private destroy$ = new Subject<void>();
  

  constructor() {}

  ngOnInit(): void {
    this.initModal();
    this.loadProduct();
  }

  // loadProduct(): void {
  //   this.productService.getSpesficProduct(this.productId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res) => {
  //         this.product.set(res.data);
  //         this.selectedImage.set(res.data.imageCover);
  //       },
  //       error: (err) => console.error('Error loading product:', err)
  //     });
  // }
  loadProduct(): void {
  this.productService.getSpesficProduct(this.productId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        if (!res?.data) return;

        // Always make sure allImages has something
        this.allImages = [
          res.data.imageCover, 
          ...(res.data.images || [])
        ].filter(Boolean); // remove null/undefined

        if (this.allImages.length > 0) {
          this.currentIndex.set(0);
          this.selectedImage.set(this.allImages[0]);
        }

        this.product.set(res.data);
      },
      error: (err) => console.error('Error loading product:', err)
    });
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.modal?.hide();
  }

  initModal(): void {
    const modalElement = document.getElementById(`quick-view-modal-${this.productId}`);
    if (modalElement) {
      const modalOptions: ModalOptions = {
        placement: 'center',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-600/50 bg-opacity-50 fixed inset-0 z-40',
        closable: true,
        onHide: () => this.cleanupModal()
      };
      this.modal = new Modal(modalElement, modalOptions);
    }
  }

  private cleanupModal(): void {
    this.quantity.set(1);
    this.selectedImage.set('');
  }

  openModal(): void {
    if (!this.modal) {
      this.initModal();
    }
    this.modal?.show();
  }

  closeModal(): void {
    this.modal?.hide();
  }

  // Image navigation methods
  changeImage(img: string): void {
    this.selectedImage.set(img);
  }

  // prevImage(): void {
  //   const images = this.product()?.images || [];
  //   if (images.length > 1) {
  //     const currentIndex = images.indexOf(this.selectedImage());
  //     const newIndex = (currentIndex - 1 + images.length) % images.length;
  //     this.selectedImage.set(images[newIndex]);
  //   }
  // }

  // nextImage(): void {
  //   const images = this.product()?.images || [];
  //   if (images.length > 1) {
  //     const currentIndex = images.indexOf(this.selectedImage());
  //     const newIndex = (currentIndex + 1) % images.length;
  //     this.selectedImage.set(images[newIndex]);
  //   }
  // }

  prevImage(): void {
  if (this.allImages.length > 1) {
    const newIndex = (this.currentIndex() - 1 + this.allImages.length) % this.allImages.length;
    this.currentIndex.set(newIndex);
    this.selectedImage.set(this.allImages[newIndex]);
  }
}

nextImage(): void {
  if (this.allImages.length > 1) {
    const newIndex = (this.currentIndex() + 1) % this.allImages.length;
    this.currentIndex.set(newIndex);
    this.selectedImage.set(this.allImages[newIndex]);
  }
}

goToImage(index: number): void {
  if (index >= 0 && index < this.allImages.length) {
    this.currentIndex.set(index);
    this.selectedImage.set(this.allImages[index]);
  }
}

  // Quantity controls
  increase(): void {
    this.quantity.update(q => q + 1);
  }

  decrease(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }


  // 

  addProductToCart(productId: string): void{
    this.loadingCart.set(true)
    this.cartService.addProductToCart(productId).subscribe({
      next: (res)=>{
        console.log(res);
        this.cartService.cartNumber.set(res.numOfCartItems);
        // this.cartService.cartNumber.next(res.numOfCartItems);
         this.toastrService.success(res.message, 'Add to Cart!', 
          {toastClass: 'ngx-toastr custom-gray-toast', 
            progressBar: true ,
            messageClass: 'text-sm'
          });
          this.loadingCart.set(false);

      },
      error: (err)=>{
        this.loadingCart.set(false);
      }
    })
  }
    addToWishlist(productId: string): void{
    this.loadingWishlist.set(true);
    this.wishlistService.addProductToWishlist(productId).subscribe({
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
}