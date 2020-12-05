import { createAction, props } from '@ngrx/store';
import { PricesData } from './game/game.models';

export const startGame = createAction('Start game');
export const stopGame = createAction('Stop game');

export const incrementDate = createAction('Increment date');

export const fetchPriceData = createAction('Fetch price data');
export const fetchPriceDataSuccess = createAction(
  'Fetch price data success',
  props<{ prices: PricesData }>(),
);
export const fetchPriceDataError = createAction(
  'Fetch price data error',
  props<{ error: string }>(),
);

interface TransactionProps {
  commodityId: number;
  number: number;
  unitPrice: number;
}

export const buyCommodity = createAction(
  'Buy commodity',
  props<TransactionProps>(),
);

export const sellCommodity = createAction(
  'Sell commodity',
  props<TransactionProps>(),
);

export const sellOutPosition = createAction(
  'Sell out position',
  props<{ commodityId: number }>(),
);
