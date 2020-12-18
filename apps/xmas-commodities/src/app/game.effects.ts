import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of, timer } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  fetchPriceData,
  fetchPriceDataError,
  fetchPriceDataSuccess,
  incrementDate,
  stopGame,
} from './actions';
import { ApiService } from './api.service';
import { MAX_DATE } from './game/game.constants';
import { AppState } from './reducers';
import { selectDate, selectIsPlaying } from './selectors';

@Injectable()
export class GameEffects {
  readonly fetchPrices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchPriceData),
      switchMap(() => {
        return this.api.getPrices().pipe(
          map((prices) => fetchPriceDataSuccess({ prices })),
          catchError((error) =>
            of(fetchPriceDataError({ error: error.toString() })),
          ),
        );
      }),
    ),
  );

  readonly incrementDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchPriceDataSuccess),
      switchMap(() => timer(0, 1000)),
      withLatestFrom(
        this.store.pipe(select(selectIsPlaying)),
        this.store.pipe(select(selectDate)),
      ),
      map(([time, isPlaying, date]) => {
        return { isPlaying, date };
      }),
      filter(({ isPlaying }) => isPlaying),
      map(({ date }) => {
        if ((date || 0) < MAX_DATE - 1) {
          return incrementDate();
        } else {
          return stopGame();
        }
      }),
    ),
  );

  readonly moveToEndGame$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopGame),
        tap(() => {
          this.router.navigate(['play', 'end']);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly api: ApiService,
    private readonly store: Store<AppState>,
    private readonly router: Router,
  ) {}
}
