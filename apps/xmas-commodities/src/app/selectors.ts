import { createSelector } from '@ngrx/store';
import { AppState, GameState } from './reducers';
import { last } from './utils';

const selectGameState = (state: AppState) => state.game;

const extractCommodities = (state: GameState) => {
  return state.prices?.map(({ commodity }) => commodity);
};

export const selectCommodities = createSelector(
  selectGameState,
  extractCommodities,
);

export const selectCommodityPrices = createSelector(
  selectGameState,
  (state: GameState, props: { id: number }): readonly number[] => {
    const commodity = state.prices?.find(
      ({ commodity }) => commodity.id === props.id,
    );
    return commodity?.prices || [];
  },
);

export const selectCash = createSelector(
  selectGameState,
  (state: GameState) => state.cash,
);

export const selectHoldings = createSelector(selectGameState, (state) => {
  const commoditiesAndPrices = state.prices;
  const holdings = state.holdings;
  return (commoditiesAndPrices || []).map(({commodity, prices}) => {
    const holding = holdings[commodity.id] || 0;
    return {
      commodity,
      holding,
      value: holding * (last(prices) || 0)
    };
  });
});
