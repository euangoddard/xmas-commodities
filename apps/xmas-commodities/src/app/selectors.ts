import { createSelector } from '@ngrx/store';
import { HISTORIC_VALUES } from './game/game.constants';
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

export const selectCommodityPrices = createSelector(
  selectGameState,
  (state: GameState, props: { id: number }): readonly number[] => {
    const commodity = state.prices?.find(
      ({ commodity }) => commodity.id === props.id,
    );
    return (commodity?.prices || []).slice(
      0,
      HISTORIC_VALUES + (state.date || 0),
    );
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

export const selectHoldings = createSelector(selectGameState, (state) => {
  const commoditiesAndPrices = state.prices;
  const holdings = state.holdings;
  const priceIndex = HISTORIC_VALUES + (state.date || 0);
  return (commoditiesAndPrices || []).map(({ commodity, prices }) => {
    const holding = holdings[commodity.id] || 0;
    return {
      commodity,
      holding,
      value: holding * (prices[priceIndex] || 0),
    };
  });
});
