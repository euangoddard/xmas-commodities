import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { AppState } from '../../reducers';
import {
  selectCommodityPriceAndChange,
  selectCommodityPriceHistory,
} from '../../selectors';
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
      return this.store.pipe(select(selectCommodityPriceHistory, { id }));
    }),
  );

  private readonly priceAndChange$ = this.commoditySubject.pipe(
    switchMap(({ id }) => {
      return this.store.pipe(select(selectCommodityPriceAndChange, { id }));
    }),
  );

  readonly currentPrice$ = this.priceAndChange$.pipe(pluck('current'));

  readonly change$ = this.priceAndChange$.pipe(pluck('change'));

  constructor(private readonly store: Store<AppState>) {}

  ngOnChanges(changes: SimpleChanges): void {
    const commodityChange = changes['commodity'];
    if (commodityChange?.currentValue) {
      this.commoditySubject.next(commodityChange.currentValue);
    }
  }
}
