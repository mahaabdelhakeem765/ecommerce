import { Component, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { IProduct } from '../../../interfaces/iproduct';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../../core/services/cart/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { ProductQuickViewComponent } from '../product-quick-view/product-quick-view.component';

@Component({
  selector: 'app-card',
  imports: [RouterModule , ProductQuickViewComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{

  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly toastrService = inject(ToastrService)
  myProduct = input.required<IProduct>() 
  wishlistIds: WritableSignal<Set<string>> = signal(new Set());
  loadingCart: WritableSignal<boolean> = signal(false);
  

  ngOnInit(): void {
    this.loadWishlistIds();
  }
  
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

  // Wishlist
    loadWishlistIds(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        const ids = res.data.map((item: any) => item._id);
        this.wishlistIds.set(new Set(ids));
      },
      error: (err) => console.error('Error loading wishlist', err)
    });
  }

  isInWishlist(): boolean {
    return this.wishlistIds().has(this.myProduct()._id);
  }
  
  addProductToWishlist(productId: string): void{
    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: (res)=>{
        console.log(res);
        // this.isInWishlist.set(true)
        const updated = new Set(this.wishlistIds());
        updated.add(productId);
        this.wishlistIds.set(updated);
        this.wishlistService.wishlistNumber.set(res.data.length)

      }
    })
  }
  deletePrpductFromWishlist(productId: string): void{
    this.wishlistService.removeProductFromWishlist(productId).subscribe({
      next: (res)=>{
        console.log(res);
        // this.isInWishlist.set(false)
        const updated = new Set(this.wishlistIds());
        updated.delete(productId);
        this.wishlistIds.set(updated);
        this.wishlistService.wishlistNumber.set(res.data.length)
      }
    })
  }
 

  
}
