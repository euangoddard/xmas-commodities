import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { sellOutPosition } from '../../actions';
import { AppState } from '../../reducers';
import { selectActiveHoldings, selectCash } from '../../selectors';
import { Commodity } from '../game.models';

@Component({
  selector: 'xmas-commodities-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss'],
})
export class HoldingsComponent {
  readonly holdings$ = this.store.pipe(select(selectActiveHoldings));
  readonly cash$ = this.store.pipe(select(selectCash));
  readonly hasNoHoldings$ = this.holdings$.pipe(map((h) => !h.length));

  constructor(private readonly store: Store<AppState>) {}

  sellOutPosition(commodity: Commodity): void {
    this.store.dispatch(sellOutPosition({ commodityId: commodity.id }));
  }
}
