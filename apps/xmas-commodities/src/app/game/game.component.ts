import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fetchPriceData, startGame } from '../actions';
import { AppState } from '../reducers';
import { selectCommodities, selectDate } from '../selectors';
import { Commodity } from './game.models';

@Component({
  selector: 'xmas-commodities-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  readonly commodities$ = this.store.pipe(select(selectCommodities));
  readonly date$ = this.store.pipe(select(selectDate));

  readonly trackById = (item: Commodity) => item.id;

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(startGame());
    this.store.dispatch(fetchPriceData());
  }
}
