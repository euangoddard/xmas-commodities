import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { buyCommodity, sellCommodity } from '../../actions';
import { AppState, COMMISSION } from '../../reducers';
import { selectCash, selectHoldings } from '../../selectors';
import { Commodity } from '../game.models';

@Component({
  selector: 'xmas-commodities-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent {
  @Input() price: number;
  @Input() commodity: Commodity;

  readonly controls: { buy: FormControl; sell: FormControl };

  constructor(
    private readonly store: Store<AppState>,
    formBuilder: FormBuilder,
  ) {
    this.controls = {
      buy: formBuilder.control(
        null,
        [Validators.required],
        [this.validateBuy()],
      ),
      sell: formBuilder.control(
        null,
        [Validators.required],
        [this.validateSell()],
      ),
    };
  }

  buy(): void {
    this.store.dispatch(
      buyCommodity({
        commodityId: this.commodity.id,
        number: this.controls.buy.value,
        unitPrice: this.price,
      }),
    );
    this.controls.buy.setValue(null);
    this.controls.buy.markAsPristine();
  }

  sell(): void {
    this.store.dispatch(
      sellCommodity({
        commodityId: this.commodity.id,
        number: this.controls.sell.value,
        unitPrice: this.price,
      }),
    );
    this.controls.sell.setValue(null);
    this.controls.sell.markAsPristine();
  }

  private validateBuy(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.store
        .pipe(
          select(selectCash),

          map((cash) => {
            const count = control.value;
            if (count) {
              const hasSufficientCash = count * this.price + COMMISSION < cash;
              return hasSufficientCash ? null : { insufficientFunds: true };
            } else {
              return null;
            }
          }),
          take(1),
        )
        .toPromise();
    };
  }

  private validateSell(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.store
        .pipe(
          select(selectHoldings),
          map(
            (holdings) =>
              holdings.find(
                ({ commodity }) => commodity.id === this.commodity.id,
              )!,
          ),
          map(({ holding }) => {
            const count = control.value;
            if (count) {
              return count <= holding ? null : { insufficientShares: true };
            } else {
              return null;
            }
          }),
          take(1),
        )
        .toPromise();
    };
  }
}
