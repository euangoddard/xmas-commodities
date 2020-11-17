import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { sellOutPosition } from '../../actions';
import { AppState } from '../../reducers';
import { selectCash, selectHoldings } from '../../selectors';
import { Commodity } from '../game.models';

@Component({
  selector: 'xmas-commodities-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss'],
})
export class HoldingsComponent {
  readonly holdings$ = this.store.pipe(select(selectHoldings));
  readonly cash$ = this.store.pipe(select(selectCash))

  constructor(private readonly store: Store<AppState>) {}

  sellOutPosition(commodity: Commodity): void {
    this.store.dispatch(sellOutPosition({ commodityId: commodity.id }));
  }
}
