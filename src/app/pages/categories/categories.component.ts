import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { HeaderComponent } from '../../shared/components/business/header/header.component';
import { Icategory } from '../../shared/interfaces/icategory';
import { RouterLink } from '@angular/router';
import { ISubCategory } from '../../shared/interfaces/isub-category';

@Component({
  selector: 'app-categories',
  imports: [HeaderComponent , RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit{

  private readonly categoriesService = inject(CategoriesService)
  categoriesList: WritableSignal<Icategory[]> = signal([])
  subCategoriesList: WritableSignal<ISubCategory[]> = signal([]);
  categoryId: WritableSignal<string> = signal('')
  categoryIdValue = '';


  ngOnInit(): void {
    this.getCategories()
    // this.GetAllSubCategoriesOnCategory()
    const hash = window.location.hash.slice(1);
    if (hash) {
      this.scrollToCategory(hash);
      this.getAllSubCategories(hash);
    }
    
  }

  getCategories(): void{
    this.categoriesService.getAllCtegories().subscribe({
      next: (res)=>{
        console.log(res);
        this.categoriesList.set(res.data)
        // this.categoryId.set(this.categoriesList().id)
      }
    })
  }

  getAllSubCategories(categoryId: string): void{
    this.categoryId.set(categoryId)
    this.categoriesService.getAllSubCategoriesOnCategory(categoryId).subscribe({
      next: (res)=>{
        console.log(res);
        this.subCategoriesList.set(res.data)
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }



  categoryName(): string {
    const selected = this.categoriesList().find(c => c._id === this.categoryId());
    return selected?.name || '';
  }

  
  categoryId2() {
    return this.categoryIdValue;
  }

  scrollToCategory(id: string): void {
  this.categoryIdValue = id;

  window.location.hash = id;

  setTimeout(() => {
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, 50);
}

scrollToTop(): void {
  setTimeout(() => {
    requestAnimationFrame(() => {
      const element = document.getElementById('category');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, 100); // Give it a short delay for DOM to update
}




}
