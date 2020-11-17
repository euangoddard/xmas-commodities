import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';
import { GameEffects } from './game.effects';
import { PricesData } from './game/game.models';

describe('Game.EffectsService', () => {
  let actions$: ReplaySubject<Action>;
  let apiService: { getPrices: () => Observable<PricesData> };
  let service: GameEffects;

  beforeEach(() => {
    apiService = { getPrices: jest.fn() };
    actions$ = new ReplaySubject<Action>(1);

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        { provide: ApiService, useValue: apiService },
        { provide: Actions, useValue: actions$ },
      ],
    });
    service = TestBed.inject(GameEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
