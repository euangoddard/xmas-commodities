import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from '../../reducers';
import { selectCash } from '../../selectors';
import { INITIAL_CASH_BALANCE } from '../game.constants';

@Component({
  selector: 'xmas-commodities-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndComponent {
  readonly initialCash = INITIAL_CASH_BALANCE;
  readonly cash$ = this.store.pipe(select(selectCash));
  readonly change$ = this.cash$.pipe(
    map((cash) => cash - INITIAL_CASH_BALANCE),
  );

  constructor(private readonly store: Store<AppState>) {}
}
