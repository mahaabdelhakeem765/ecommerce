import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/business/header/header.component';

@Component({
  selector: 'app-cart',
  imports: [RouterLink , HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  private readonly cartService = inject(CartService);
  cart: WritableSignal<ICart> = signal({} as ICart);
  deletingProductId = signal<string | null>(null);
  totalCartPrice: WritableSignal<string> = signal('');
  numOfCartItems: WritableSignal<string> = signal('');
  


  ngOnInit(): void {
    this.callGetLoggedUserCart()
  }

  callGetLoggedUserCart(): void{
    this.cartService.getLoggedUserCart().subscribe({
      next: (res)=>{
        this.cart.set(res.data);
        this.totalCartPrice.set(res.data.totalCartPrice)
        this.numOfCartItems.set(res.numOfCartItems)
        console.log(this.cart());
        
      }
    })
  }

  removeItem(productId: string): void{
    this.deletingProductId.set(productId);
    this.cartService.removeSpecificCartItem(productId).subscribe({
      next: (res)=>{
        console.log(res);
        this.cart.set(res.data);
        this.totalCartPrice.set(res.data.totalCartPrice)
        this.numOfCartItems.set(res.numOfCartItems)
        this.deletingProductId.set(null);
        this.cartService.cartNumber.set(res.numOfCartItems)
        
      },
      error: (err)=>{
        console.log(err);
        this.deletingProductId.set(null);
        
      }
    })
  }
  
  updateQuantityProduct(prosuctId: string , quantity: number): void{
     if (quantity < 1) {
      return;
    }
    this.cartService.updateCartProductQuantity(prosuctId , quantity).subscribe({
      next: (res)=>{
        // console.log(res);
        this.cart.set(res.data);
        this.totalCartPrice.set(res.data.totalCartPrice);
      }
    })
  }

  getLocalProductCount(productId: string): number {
    const prod = this.cart().products.find(p => p.product._id === productId);
    return prod ? prod.count : 0;
  }

  deleteCart(): void{
    document.body.style.cursor = 'wait';
    this.cartService.clearUserCart().subscribe({
      next: (res)=>{
        console.log(res);
        this.cart.set({} as ICart);
        this.cartService.cartNumber.set(0)
        
      },
      complete: ()=>{
        document.body.style.cursor = 'default';
      }
    })
  }

}
