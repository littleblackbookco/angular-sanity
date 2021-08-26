import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { arrayFind, filterNilValue } from '@datorama/akita';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';
import { CartQuery } from '../../state/cart.query';
import { CartService } from '../../state/cart.service';
import { CartStore } from '../../state/cart.store';

@Component({
  selector: 'app-cart-input',
  templateUrl: './cart-input.component.html',
  styleUrls: ['./cart-input.component.scss'],
})
export class CartInputComponent implements OnInit, OnDestroy {
  @Input() itemId!: string;
  @Input() quantity!: number;
  @Input() autoUpdateCart = false;
  input = new FormControl(0, {
    updateOn: 'change',
    validators: [Validators.required, Validators.min(0)],
  });
  onDestroyed = new Subject();
  constructor(private cartQuery: CartQuery, private cartService: CartService) {}

  decrease() {
    this.input.setValue(this.input.value - 1);
    this.input.markAsDirty();
    if (this.autoUpdateCart) {
      this.cartService.update({ id: this.itemId, quantity: this.input.value });
    }
  }

  increase() {
    this.input.setValue(this.input.value + 1);
    this.input.markAsDirty();
    if (this.autoUpdateCart) {
      this.cartService.update({ id: this.itemId, quantity: this.input.value });
    }
  }

  ngOnInit(): void {
    this.input.setValidators(Validators.max(this.quantity));
    this.cartQuery
      .selectEntity(CartStore.ID, 'items')
      .pipe(
        takeUntil(this.onDestroyed),
        filterNilValue(),
        arrayFind(this.itemId),
        pluck('quantity')
      )
      .subscribe((quantity) => {
        this.input.setValue(quantity || 0);
        this.input.markAllAsTouched();
        this.input.markAsPristine();
      });
  }

  ngOnDestroy() {
    this.onDestroyed.next();
  }
}
