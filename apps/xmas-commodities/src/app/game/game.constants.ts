export const INTERVAL_MINS = 15;

export const MARKET_OPEN = 8;

const MARKET_CLOSE = 16;

// We want to support the market close before the next day market open (so add 1!)
export const INTERVALS_PER_DAY =
  1 + (MARKET_CLOSE - MARKET_OPEN) * (60 / INTERVAL_MINS);

export const MAX_DATE = INTERVALS_PER_DAY * 24;

export const HISTORIC_VALUES = 100;

export const INITIAL_CASH_BALANCE = 10000;

export const COMMISSION = 10;
