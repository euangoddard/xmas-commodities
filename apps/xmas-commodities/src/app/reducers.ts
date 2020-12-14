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
import { COMMISSION, INITIAL_CASH_BALANCE } from './game/game.constants';
import { PricesData } from './game/game.models';
import { getCurrentPrice, getHoldingOrDefault } from './game/game.utils';
import { Mapping } from './types';

export interface Holding {
  number: number;
  avgCost: number;
}

export interface GameState {
  playing: boolean;
  cash: number;
  prices: PricesData | null;
  date: number | null;
  holdings: Mapping<Holding>;
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
    // Sell everything
    const holdings = state.holdings;
    let cashIncrement = 0;
    for (const { commodity, prices } of state.prices ?? []) {
      const currentHolding = holdings[commodity.id]?.number || 0;
      if (currentHolding === 0) {
        continue;
      }
      const currentPrice = getCurrentPrice(prices, state.date);
      cashIncrement += currentHolding * currentPrice - COMMISSION;
    }

    return {
      ...state,
      playing: false,
      cash: state.cash + cashIncrement,
      holdings: {},
    };
  }),
  on(incrementDate, (state) => {
    return { ...state, date: (state.date || 0) + 1 };
  }),
  on(fetchPriceDataSuccess, (state, { prices }) => {
    return { ...state, prices };
  }),
  on(buyCommodity, (state, { commodityId, unitPrice, number }) => {
    const newBalance = state.cash - unitPrice * number - COMMISSION;
    const exitingHolding = getHoldingOrDefault(state, commodityId);
    const newAvgCost =
      (exitingHolding.number * exitingHolding.avgCost + number * unitPrice) /
      (exitingHolding.number + number);
    const newHolding: Holding = {
      number: exitingHolding.number + number,
      avgCost: newAvgCost,
    };
    return {
      ...state,
      cash: newBalance,
      holdings: { ...state.holdings, [commodityId]: newHolding },
    };
  }),
  on(sellCommodity, (state, { commodityId, unitPrice, number }) => {
    const newBalance = state.cash + unitPrice * number - COMMISSION;
    const exitingHolding = getHoldingOrDefault(state, commodityId);
    const newHolding: Holding = {
      ...exitingHolding,
      number: exitingHolding.number - number,
    };
    let newHoldings: Mapping<Holding>;
    if (newHolding.number) {
      newHoldings = { ...state.holdings, [commodityId]: newHolding };
    } else {
      newHoldings = withoutCommodity(state.holdings, commodityId);
    }
    return {
      ...state,
      cash: newBalance,
      holdings: newHoldings,
    };
  }),
  on(sellOutPosition, (state, { commodityId }) => {
    const currentHolding = state.holdings[commodityId]?.number || 0;
    if (currentHolding === 0) {
      return state;
    }

    const commodityPrices = state.prices!.find(
      (p) => p.commodity.id === commodityId,
    )!.prices;
    const currentPrice = getCurrentPrice(commodityPrices, state.date);
    const cashIncrement = currentHolding * currentPrice - COMMISSION;
    return {
      ...state,
      holdings: withoutCommodity(state.holdings, commodityId),
      cash: state.cash + cashIncrement,
    };
  }),
);

export function reducer(state: GameState | undefined, action: Action) {
  return gameReducer(state, action);
}

function withoutCommodity(
  holdings: Mapping<Holding>,
  commodityId: number,
): Mapping<Holding> {
  const copy = { ...holdings };
  delete copy[commodityId];
  return copy;
}
