import { INIT } from '@ngrx/store';
import {
  buyCommodity,
  fetchPriceDataSuccess,
  incrementDate,
  sellCommodity,
  sellOutPosition,
  startGame,
  stopGame,
} from './actions';
import { COMMISSION, HISTORIC_VALUES } from './game/game.constants';
import { PriceData } from './game/game.models';
import { GameState, reducer } from './reducers';

const PRICES_DATA: readonly PriceData[] = [
  {
    commodity: { id: 1, name: 'Commodity 1', colour: 'white' },
    prices: range(100, 200),
  },
  {
    commodity: { id: 2, name: 'Commodity 2', colour: 'black' },
    prices: range(500, 200),
  },
];

describe('Reducers', () => {
  it('should support the initial state', () => {
    expect(reducer(undefined, { type: INIT })).toEqual({
      playing: false,
      cash: 10000,
      prices: null,
      date: null,
      holdings: {},
    });
  });

  it('should support the start game action', () => {
    expect(
      reducer(
        {
          ...getInitialState(),
          cash: 0,
          prices: PRICES_DATA,
          date: 64,
          holdings: { '1': { number: 2, avgCost: 1 } },
        },
        startGame,
      ),
    ).toEqual({
      playing: true,
      cash: 10000,
      prices: null,
      date: 0,
      holdings: {},
    });
  });

  it('should support the stop game action', () => {
    const date = 45;
    const holding1Value = (100 + HISTORIC_VALUES + date) * 50 - COMMISSION;
    const holding2Value = (500 + HISTORIC_VALUES + date) * 100 - COMMISSION;
    expect(
      reducer(
        {
          ...getInitialState(),
          cash: 346,
          playing: true,
          prices: PRICES_DATA,
          date,
          holdings: {
            '1': { number: 50, avgCost: 100 },
            '2': { number: 100, avgCost: 200 },
          },
        },
        stopGame,
      ),
    ).toEqual({
      playing: false,
      cash: 346 + holding1Value + holding2Value,
      prices: PRICES_DATA,
      date,
      holdings: {},
    });
  });

  it('should support the incrementDate action', () => {
    const date = 45;
    expect(
      reducer(
        {
          ...getInitialState(),
          cash: 346,
          playing: true,
          prices: PRICES_DATA,
          date,
          holdings: { '2': { number: 45, avgCost: 2 } },
        },
        incrementDate,
      ),
    ).toEqual({
      playing: true,
      cash: 346,
      prices: PRICES_DATA,
      date: date + 1,
      holdings: { '2': { number: 45, avgCost: 2 } },
    });
  });

  it('should store the prices in the store on successful fetch', () => {
    const action = fetchPriceDataSuccess({ prices: PRICES_DATA });
    const initialState = getInitialState();
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      prices: PRICES_DATA,
    });
  });

  describe('Buying a commodity', () => {
    let initialState: GameState;
    beforeEach(() => {
      initialState = {
        ...getInitialState(),
        cash: 10000,
        playing: true,
        prices: PRICES_DATA,
        date: 6,
        holdings: { '1': { number: 45, avgCost: 50 } },
      };
    });

    it('should add a new holding and update the cash balance taking into account commission', () => {
      expect(
        reducer(
          initialState,
          buyCommodity({ commodityId: 2, number: 10, unitPrice: 100 }),
        ),
      ).toEqual({
        ...initialState,
        holdings: {
          ...initialState.holdings,
          '2': { number: 10, avgCost: 100 },
        },
        cash: 8990,
      });
    });

    it('should increment a current holding and update the cash balance taking into account commission', () => {
      const newAvgCost = (45 * 50 + 10 * 60) / (45 + 10);
      expect(
        reducer(
          initialState,
          buyCommodity({ commodityId: 1, number: 10, unitPrice: 60 }),
        ),
      ).toEqual({
        ...initialState,
        holdings: { '1': { number: 55, avgCost: newAvgCost } },
        cash: 10000 - 60 * 10 - COMMISSION,
      });
    });
  });

  describe('Selling a commodity', () => {
    let initialState: GameState;
    beforeEach(() => {
      initialState = {
        ...getInitialState(),
        cash: 10000,
        playing: true,
        prices: PRICES_DATA,
        date: 3,
        holdings: { '1': { number: 45, avgCost: 1.56 } },
      };
    });

    it('should sell out a holding completely and update the cash balance taking into account commission', () => {
      expect(
        reducer(
          initialState,
          sellCommodity({ commodityId: 1, number: 45, unitPrice: 100 }),
        ),
      ).toEqual({
        ...initialState,
        holdings: {},
        cash: 14490,
      });
    });

    it('should partially sell a holding and update the cash balance taking into account commission', () => {
      expect(
        reducer(
          initialState,
          sellCommodity({ commodityId: 1, number: 10, unitPrice: 50 }),
        ),
      ).toEqual({
        ...initialState,
        holdings: { '1': { number: 35, avgCost: 1.56 } },
        cash: 10490,
      });
    });
  });

  describe('Selling out a position', () => {
    let initialState: GameState;
    beforeEach(() => {
      initialState = {
        ...getInitialState(),
        cash: 10000,
        playing: true,
        prices: PRICES_DATA,
        date: 3,
        holdings: { '1': { number: 45, avgCost: 4.56 } },
      };
    });

    it('should do nothing if there is no holding', () => {
      expect(
        reducer(initialState, sellOutPosition({ commodityId: 2 })),
      ).toEqual(initialState);
    });

    it('should close out the position and update the cash balance', () => {
      const salePrice = 100 + 100 + 3;
      expect(
        reducer(initialState, sellOutPosition({ commodityId: 1 })),
      ).toEqual({
        ...initialState,
        holdings: {},
        cash: 10000 + salePrice * 45 - COMMISSION,
      });
    });
  });
});

function getInitialState(): GameState {
  return reducer(undefined, { type: INIT });
}

function range(start: number, count: number): readonly number[] {
  return Array.from(new Array(count), (_, index) => start + index);
}
