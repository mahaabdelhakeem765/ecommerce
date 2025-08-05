import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { PaymentService } from '../../core/services/payment/payment.service';
import { IOrder } from '../../shared/interfaces/iorder';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from '../../shared/components/business/header/header.component';

@Component({
  selector: 'app-allorders',
  imports: [DatePipe, HeaderComponent],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css'
})
export class AllordersComponent implements OnInit{

  private readonly authService = inject(AuthService)
  private readonly paymentService = inject(PaymentService)
  userId: WritableSignal<string | null> = signal(null)
  orders: WritableSignal<IOrder[]> = signal({} as IOrder[])

  ngOnInit(): void {
    this.getUserId()
    this.callGetUserOrders()
    
  }

  getUserId(): void{
    // this.authService.saveUserData()
    // this.userId.set(this.authService.userData()?.id !)
    // console.log('userId:'  + this.userId);
    this.authService.saveUserData(); // ✅ call to populate the signal in AuthService
    const user = this.authService.userData(); // ✅ read the signal
    if (user) {
      this.userId.set(user.id);
      console.log('userId:', this.userId());
    }
    
  }

  callGetUserOrders(): void{
    this.paymentService.getUserOrders(this.userId()!).subscribe({
      next:(res)=>{
        console.log(res);
        this.orders.set(res)

      },
      error:(err)=>{
        console.log(err);

      }
    })
  }
  
  getTotalQuantity(order: any): number {
  return order.cartItems.reduce((total: number, item: any) => total + item.count, 0);
}


}
