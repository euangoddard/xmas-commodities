import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fetchPriceData } from '../actions';
import { AppState } from '../reducers';
import { selectCommodities } from '../selectors';
import { Commodity } from './game.models';

@Component({
  selector: 'xmas-commodities-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  readonly commodities$ = this.store.pipe(select(selectCommodities));
  readonly trackById = (item: Commodity) => item.id;

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(fetchPriceData());
  }
}
