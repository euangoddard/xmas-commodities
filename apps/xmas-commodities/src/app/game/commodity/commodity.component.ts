import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppState } from '../../reducers';
import { selectCommodityPrices } from '../../selectors';
import { Commodity } from '../game.models';

@Component({
  selector: 'xmas-commodities-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss'],
  host: {
    '[style.--theme-color]': 'commodity.colour',
  },
})
export class CommodityComponent implements OnChanges {
  @Input() commodity: Commodity;

  private readonly commoditySubject = new ReplaySubject<Commodity>(1);
  readonly prices$ = this.commoditySubject.pipe(
    switchMap(({ id }) => {
      return this.store.pipe(select(selectCommodityPrices, { id }));
    }),
  );
  readonly lastPrice$ = this.prices$.pipe(map((prices) => prices.slice(-1)[0]));

  readonly change$ = this.prices$.pipe(
    map((prices) => {
      const [last, current] = prices.slice(-2);
      return current - last;
    }),
  );

  constructor(private readonly store: Store<AppState>) {}

  ngOnChanges(changes: SimpleChanges): void {
    const commodityChange = changes['commodity'];
    if (commodityChange?.currentValue) {
      this.commoditySubject.next(commodityChange.currentValue);
    }
  }
}
