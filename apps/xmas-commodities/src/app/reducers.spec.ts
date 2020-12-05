import { INIT } from '@ngrx/store';
import {
  buyCommodity,
  fetchPriceDataSuccess, incrementDate,
  sellCommodity,
  sellOutPosition,
  startGame,
  stopGame
} from './actions';
import { PriceData } from './game/game.models';
import { GameState, reducer } from './reducers';

const PRICES_DATA: readonly PriceData[] = [
  {
    commodity: { id: 1, name: 'Commodity 1', colour: 'white' },
    prices: [100, 102, 145],
  },
  {
    commodity: { id: 2, name: 'Commodity 2', colour: 'black' },
    prices: [200, 210, 190],
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
          holdings: { '1': 2 },
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
    expect(
      reducer(
        {
          ...getInitialState(),
          cash: 346,
          playing: true,
          prices: PRICES_DATA,
          date,
          holdings: { '2': 45 },
        },
        stopGame,
      ),
    ).toEqual({
      playing: false,
      cash: 346,
      prices: PRICES_DATA,
      date,
      holdings: { '2': 45 },
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
          holdings: { '2': 45 },
        },
        incrementDate,
      ),
    ).toEqual({
      playing: true,
      cash: 346,
      prices: PRICES_DATA,
      date: date + 1,
      holdings: { '2': 45 },
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
        holdings: { '1': 45 },
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
        holdings: { ...initialState.holdings, '2': 10 },
        cash: 8990,
      });
    });

    it('should increment a current holding and update the cash balance taking into account commission', () => {
      expect(
        reducer(
          initialState,
          buyCommodity({ commodityId: 1, number: 10, unitPrice: 50 }),
        ),
      ).toEqual({
        ...initialState,
        holdings: { '1': 55 },
        cash: 9490,
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
        holdings: { '1': 45 },
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
        holdings: { ...initialState.holdings, '1': 0 },
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
        holdings: { '1': 35 },
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
        holdings: { '1': 45 },
      };
    });

    it('should do nothing if there is no holding', () => {
      expect(
        reducer(initialState, sellOutPosition({ commodityId: 2 })),
      ).toEqual(initialState);
    });

    it('should close out the position and update the cash balance', () => {
      expect(
        reducer(initialState, sellOutPosition({ commodityId: 1 })),
      ).toEqual({
        ...initialState,
        holdings: { '1': 0 },
        cash: 16515,
      });
    });
  });
});

function getInitialState(): GameState {
  return reducer(undefined, { type: INIT });
}
