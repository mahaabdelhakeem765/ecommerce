import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { CartService } from '../../core/services/cart/cart.service';
import { HeaderComponent } from '../../shared/components/business/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [HeaderComponent , RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit{

  private readonly wishlistService  = inject(WishlistService);
  private readonly cartService  = inject(CartService);
  wishListArray: WritableSignal<IWishlist[]> = signal([])
  deletingProductId = signal<string | null>(null);
  loadingAddProductId = signal<string | null>(null);



  ngOnInit(): void {
    this.callGetLoggedUserWishlist()
    
  }

  callGetLoggedUserWishlist(): void{
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res)=>{
        console.log(res.data);
        this.wishListArray.set(res.data)
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  deleteProductFromWishlist(productId: string): void{
    this.deletingProductId.set(productId);
    this.wishlistService.removeProductFromWishlist(productId).subscribe({
      next: (res)=>{
        console.log(res);
        // this.wishListArray.set(res.data)   --> error backend not return data => make filter
      const updatedWishlist = this.wishListArray().filter(item => item._id !== productId);
      this.wishListArray.set(updatedWishlist);
      this.deletingProductId.set(null);
      this.wishlistService.wishlistNumber.set(res.data.length);

      },
      error: (err)=>{
        console.log(err);
        this.deletingProductId.set(null);

      }
    })
  }

  addProductToCart(productId: string): void{
    this.loadingAddProductId.set(productId);
    document.body.style.cursor = 'wait';
    this.cartService.addProductToCart(productId).subscribe({
      next: (res)=>{
        console.log(res);
        this.cartService.cartNumber.set(res.numOfCartItems)

      },
      error: (err)=>{
        console.log(err);
        
      },
      complete: () => {
      this.loadingAddProductId.set(null);
      document.body.style.cursor = 'default';
    }
    })
  }
  

  
}
