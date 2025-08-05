import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment/payment.service';
// import { ErrorMsgComponent } from "../../shared/components/error-msg/error-msg.component";
import { ErrorMsgComponent } from '../../shared/components/business/error-msg/error-msg.component';
import { HeaderComponent } from "../../shared/components/business/header/header.component";
declare var $: any;


@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, ErrorMsgComponent, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit , AfterViewInit {
  @ViewChild('citySelect') citySelect!: ElementRef;

  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router)
  paymentForm!: FormGroup;
  cartId: WritableSignal<string> = signal('')
  isLoading: WritableSignal<boolean> = signal(false)
  paymentMethod: WritableSignal<'cash' | 'visa' | null> = signal(null);

  

  cities: string[] = [
    'Cairo', 'Giza', 'Alexandria', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El-Sheikh',
    'Tanta', 'Mansoura', 'Zagazig', 'Suez', 'Ismailia', 'Faiyum', 'Minya', 'Beni Suef',
    'Assiut'
  ];

  ngOnInit(): void {
    this.initForm()
    this.initActivatedRoute()
  }
  ngAfterViewInit(): void {
    const selectElement = $(this.citySelect.nativeElement);

    selectElement.select2({
      placeholder: 'Select a City',
    });

    // Sync Select2 change with Angular form control
    selectElement.on('change', (e: any) => {
      const selectedCity = e.target.value;
      this.paymentForm.get('city')?.setValue(selectedCity);
    });
  }

  initForm(): void{
    this.paymentForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: [null, [Validators.required]]
    })
  }

  initActivatedRoute(): void{
    this.activatedRoute.paramMap.subscribe({
      next: (res)=>{
        console.log(res.get('id'));
        this.cartId.set(res.get('id')!)
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  submitForm(): void{
    if(this.paymentForm.valid){
      console.log(this.paymentForm.value);
      if (this.paymentMethod() === 'visa') {
        this.visaPayment();
      } else if (this.paymentMethod() === 'cash') {
        this.cashPayment();
      }
    }else{
      this.paymentForm.markAllAsTouched()
    }
    
  }

  visaPayment(): void{
    this.isLoading.set(true)
    this.paymentService.ckeckoutSession(this.cartId() , this.paymentForm.value).subscribe({
      next: (res)=>{
        console.log(res);
        this.isLoading.set(false)
        if(res.status === 'success'){
          window.open(res.session.url , '_self')
        }
      },
      error: (err)=>{
        console.log(err);
        this.isLoading.set(false)
        
      }
    })
  }

  cashPayment(): void{
    this.isLoading.set(true)
    this.paymentService.createCashOrder(this.cartId() , this.paymentForm.value).subscribe({
      next: (res)=>{
        console.log(res);
        this.isLoading.set(false)
        if(res.status === "success"){
          this.router.navigate(['/allorders']);
        }
      },
      error: (err)=>{
        console.log(err);
        this.isLoading.set(false)
        
      }
    })
  }

  togglePaymentMethod(method: 'cash' | 'visa'): void {
  this.paymentMethod.set(
    this.paymentMethod() === method ? null : method
  );
}



  // 
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
selectedIndex: number | null = null;

selectOnlyOne(index: number) {
  this.selectedIndex = this.selectedIndex === index ? null : index;
}



}
