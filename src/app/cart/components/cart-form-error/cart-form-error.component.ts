import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-cart-form-error',
  templateUrl: './cart-form-error.component.html',
  styleUrls: ['./cart-form-error.component.scss'],
})
export class CartFormErrorComponent {
  @Input() fc!: AbstractControl | null;
}
