import { WishlistService } from './../../core/services/wishlist.service';
import { Component, computed, input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink , RouterLinkActive ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  isLoggedIn = input.required<boolean>()
  // numOfCartItems: WritableSignal<number> = signal(0)
  numOfCartItems: Signal<number> = computed( ()=>this.cartService.cartNumber() )
  wishlistLength: Signal<number> = computed( ()=>this.wishlistService.wishlistNumber() )

  constructor(private flowbiteService: FlowbiteService , private authService:AuthService , private cartService: CartService , private wishlistService : WishlistService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    // this.numOfCartItems.set(this.cartService.cartNumber());
    // this.cartService.cartNumber.subscribe({
    //   next: (value)=>{
    //     this.numOfCartItems.set(value)
    //   }
    // })

    // cart
    this.cartService.getLoggedUserCart().subscribe({
      next: (res)=>{
        console.log(res);
        this.cartService.cartNumber.set(res.numOfCartItems)
        
      },
      error: (err)=>{
        console.log(err);
        
      }
    })

    // wishkist
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res)=>{
        console.log(res);
        this.wishlistService.wishlistNumber.set(res.data.length)

      },
      error: (err)=>{
        console.log(err);
        
      }
    })


  }

  logOut(): void{
    this.authService.signOut()
  }
  
}
