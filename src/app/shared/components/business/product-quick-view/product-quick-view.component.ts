import { Component, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Modal } from 'flowbite';
import type { ModalInterface, ModalOptions } from 'flowbite';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../../../core/services/product/products.service';
import { IProduct } from '../../../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-quick-view',
  imports: [CurrencyPipe],
  templateUrl: './product-quick-view.component.html',
  styleUrl: './product-quick-view.component.css'
})
export class ProductQuickViewComponent implements OnInit, OnDestroy {
  @Input() productId: string = '';
  modal: ModalInterface | null = null;
  product: WritableSignal<IProduct | null> = signal(null);
  selectedImage = signal('');
  quantity = signal(1);
  
  private destroy$ = new Subject<void>();
  

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.initModal();
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getSpesficProduct(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.product.set(res.data);
          this.selectedImage.set(res.data.imageCover);
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
        backdropClasses: 'bg-gray-900 bg-opacity-50 fixed inset-0 z-40',
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

  prevImage(): void {
    const images = this.product()?.images || [];
    if (images.length > 1) {
      const currentIndex = images.indexOf(this.selectedImage());
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      this.selectedImage.set(images[newIndex]);
    }
  }

  nextImage(): void {
    const images = this.product()?.images || [];
    if (images.length > 1) {
      const currentIndex = images.indexOf(this.selectedImage());
      const newIndex = (currentIndex + 1) % images.length;
      this.selectedImage.set(images[newIndex]);
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
}