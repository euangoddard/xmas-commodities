import { GameState, Holding } from '../reducers';
import { HISTORIC_VALUES } from './game.constants';

export function getCurrentPrice(
  prices: readonly number[],
  date: number | null,
): number {
  return prices[HISTORIC_VALUES + (date || 0)];
}

export function getPreviousPrice(
  prices: readonly number[],
  date: number | null,
): number {
  return prices[HISTORIC_VALUES + (date || 0) - 1];
}

export function getHoldingOrDefault(
  state: GameState,
  commodityId: number,
): Holding {
  return state.holdings[commodityId] || { number: 0, avgCost: 0 };
}
