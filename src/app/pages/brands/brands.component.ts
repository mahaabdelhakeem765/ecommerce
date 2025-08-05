import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/business/header/header.component';

@Component({
  selector: 'app-brands',
  imports: [RouterLink , HeaderComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit{

  private readonly brandsService = inject(BrandsService);
  brandsList: WritableSignal<IBrand[]> = signal([])

  ngOnInit(): void {
    this.getBrands()
    
  }

  getBrands(): void{
    this.brandsService.getAllBrands().subscribe({
      next: (res)=>{
        console.log(res.data);
        this.brandsList.set(res.data)
      }
    })
  }

}
