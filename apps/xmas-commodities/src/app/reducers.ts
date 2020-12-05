import { Action, createReducer, on } from '@ngrx/store';
import {
  buyCommodity,
  fetchPriceDataSuccess,
  incrementDate,
  sellCommodity,
  sellOutPosition,
  startGame,
  stopGame,
} from './actions';
import { PricesData } from './game/game.models';
import { Mapping } from './types';
import { last } from './utils';

const INITIAL_CASH_BALANCE = 10000;
export const COMMISSION = 10;

export interface GameState {
  playing: boolean;
  cash: number;
  prices: PricesData | null;
  date: number | null;
  holdings: Mapping<number>;
}

export interface AppState {
  game: GameState;
}

export const initialGameState: GameState = {
  playing: false,
  cash: INITIAL_CASH_BALANCE,
  prices: null,
  date: null,
  holdings: {},
};

const gameReducer = createReducer(
  initialGameState,
  on(startGame, (state) => {
    return {
      ...state,
      playing: true,
      cash: INITIAL_CASH_BALANCE,
      prices: null,
      date: 0,
      holdings: {},
    };
  }),
  on(stopGame, (state) => {
    return { ...state, playing: false };
  }),
  on(incrementDate, (state) => {
    return { ...state, date: (state.date || 0) + 1 };
  }),
  on(fetchPriceDataSuccess, (state, { prices }) => {
    return { ...state, prices };
  }),
  on(buyCommodity, (state, { commodityId, unitPrice, number }) => {
    const newBalance = state.cash - unitPrice * number - COMMISSION;
    const newHolding = (state.holdings[commodityId] || 0) + number;
    return {
      ...state,
      cash: newBalance,
      holdings: { ...state.holdings, [commodityId]: newHolding },
    };
  }),
  on(sellCommodity, (state, { commodityId, unitPrice, number }) => {
    const newBalance = state.cash + unitPrice * number - COMMISSION;
    const newHolding = (state.holdings[commodityId] || 0) - number;
    return {
      ...state,
      cash: newBalance,
      holdings: { ...state.holdings, [commodityId]: newHolding },
    };
  }),
  on(sellOutPosition, (state, { commodityId }) => {
    const currentHolding = state.holdings[commodityId] || 0;
    if (currentHolding === 0) {
      return state;
    }

    const commodityPrices = state.prices!.find(
      (p) => p.commodity.id === commodityId,
    )!.prices;
    const latestPrice = last(commodityPrices)!;
    const cashIncrement = currentHolding * latestPrice - COMMISSION;
    return {
      ...state,
      holdings: { ...state.holdings, [commodityId]: 0 },
      cash: state.cash + cashIncrement,
    };
  }),
);

export function reducer(state: GameState | undefined, action: Action) {
  return gameReducer(state, action);
}
