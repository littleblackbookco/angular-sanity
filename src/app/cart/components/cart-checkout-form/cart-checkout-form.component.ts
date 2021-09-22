import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart-checkout-form',
  templateUrl: './cart-checkout-form.component.html',
  styleUrls: ['./cart-checkout-form.component.scss'],
})
export class CartCheckoutFormComponent implements OnInit {
  customerForm = this.fb.group({
    contact: this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    }),
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    }),
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
