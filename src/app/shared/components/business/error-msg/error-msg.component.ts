import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error-msg',
  imports: [],
  templateUrl: './error-msg.component.html',
  styleUrl: './error-msg.component.css'
})
export class ErrorMsgComponent {

  // controls = input.required<AbstractControl | null>()
   @Input({ required: true }) controls!: AbstractControl | null;
   @Input() patrrenName: string = ''

}
