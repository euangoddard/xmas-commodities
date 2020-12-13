import { createSelector } from '@ngrx/store';
import { HISTORIC_VALUES } from './game/game.constants';
import {
  getCurrentPrice,
  getHoldingOrDefault,
  getPreviousPrice,
} from './game/game.utils';
import { AppState, GameState } from './reducers';

const selectGameState = (state: AppState) => state.game;

const extractCommodities = (state: GameState) => {
  return state.prices?.map(({ commodity }) => commodity);
};

export const selectCommodities = createSelector(
  selectGameState,
  extractCommodities,
);

export const selectDate = createSelector(
  selectGameState,
  (state: GameState) => state.date,
);

export const selectCommodityPriceHistory = createSelector(
  selectGameState,
  (state: GameState, props: { id: number }): readonly number[] => {
    const commodity = state.prices?.find(
      ({ commodity }) => commodity.id === props.id,
    );
    const startIndex = state.date || 0;
    return (commodity?.prices || []).slice(
      startIndex,
      HISTORIC_VALUES + startIndex,
    );
  },
);

export const selectCommodityPriceAndChange = createSelector(
  selectGameState,
  (
    state: GameState,
    props: { id: number },
  ): { current: number; change: number } => {
    const commodity = state.prices?.find(
      ({ commodity }) => commodity.id === props.id,
    );
    const prices = commodity?.prices ?? [];
    const currentPrice = getCurrentPrice(prices, state.date);
    const previousPrice = getPreviousPrice(prices, state.date);
    return {
      current: currentPrice,
      change: currentPrice - previousPrice,
    };
  },
);

export const selectCash = createSelector(
  selectGameState,
  (state: GameState) => state.cash,
);

export const selectIsPlaying = createSelector(
  selectGameState,
  (state: GameState) => state.playing,
);

export const selectActiveHoldings = createSelector(selectGameState, (state) => {
  const commoditiesAndPrices = state.prices;
  return (commoditiesAndPrices || [])
    .map(({ commodity, prices }) => {
      const holding = getHoldingOrDefault(state, commodity.id);
      const currentPrice = getCurrentPrice(prices, state.date);
      const valuation = holding.number * currentPrice;
      return {
        commodity,
        holding,
        valuation,
        gain: valuation - holding.number * holding.avgCost,
      };
    })
    .filter(({ holding }) => !!holding.number);
});
