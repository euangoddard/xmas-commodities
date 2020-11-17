import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  fetchPriceData,
  fetchPriceDataError,
  fetchPriceDataSuccess,
} from './actions';
import { ApiService } from './api.service';

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

  constructor(
    private readonly actions$: Actions,
    private readonly api: ApiService,
  ) {}
}
