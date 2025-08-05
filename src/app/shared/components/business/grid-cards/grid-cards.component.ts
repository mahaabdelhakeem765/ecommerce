import { Component, input, signal, WritableSignal } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { IProduct } from '../../../interfaces/iproduct';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grid-cards',
  imports: [CardComponent , FormsModule ],
  templateUrl: './grid-cards.component.html',
  styleUrl: './grid-cards.component.css'
})
export class GridCardsComponent {
  
  // searchItems: WritableSignal<string> = signal('');
  // myProducts = input.required<IProduct[]>();
  myProducts = input<IProduct[] | null>();

}
