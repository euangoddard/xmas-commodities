import {
  ConnectedPosition,
  OverlayConnectionPosition,
} from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { buyCommodity, sellCommodity } from '../../actions';
import { AppState } from '../../reducers';
import { selectActiveHoldings, selectCash } from '../../selectors';
import { COMMISSION } from '../game.constants';
import { Commodity } from '../game.models';

@Component({
  selector: 'xmas-commodities-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnChanges {
  @Input() price: number;
  @Input() commodity: Commodity;

  readonly controls: { buy: FormControl; sell: FormControl };

  readonly buyTotal$: Observable<number | null>;
  readonly sellTotal$: Observable<number | null>;

  readonly positions: readonly ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];

  private readonly priceSubject = new ReplaySubject<number>(1);

  constructor(
    private readonly store: Store<AppState>,
    formBuilder: FormBuilder,
  ) {
    this.controls = {
      buy: formBuilder.control(null, {
        validators: [Validators.required, Validators.min(1)],
        asyncValidators: [this.validateBuy()],
        updateOn: 'change',
      }),
      sell: formBuilder.control(null, {
        validators: [Validators.required, Validators.min(1)],
        asyncValidators: [this.validateSell()],
        updateOn: 'change',
      }),
    };

    this.buyTotal$ = combineLatest([
      this.controls.buy.valueChanges,
      this.controls.buy.statusChanges,
      this.priceSubject,
    ]).pipe(
      map(([value, status, price]) => {
        if (status === 'VALID') {
          return price * value + COMMISSION;
        } else {
          return null;
        }
      }),
      shareReplay(1),
    );

    this.sellTotal$ = combineLatest([
      this.controls.sell.valueChanges,
      this.controls.sell.statusChanges,
      this.priceSubject,
    ]).pipe(
      map(([value, status, price]) => {
        if (status === 'VALID') {
          return price * value - COMMISSION;
        } else {
          return null;
        }
      }),
      shareReplay(1),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const priceChange = changes['price'];
    if (priceChange?.currentValue) {
      this.priceSubject.next(priceChange.currentValue);
    }
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
          select(selectActiveHoldings),
          map(
            (holdings) =>
              holdings.find(
                ({ commodity }) => commodity.id === this.commodity.id,
              )!,
          ),
          map((value) => value?.holding ?? { number: 0, avgCost: 0 }),
          map((holding) => {
            const count = control.value;
            if (count) {
              return count <= holding.number
                ? null
                : { insufficientShares: true };
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
