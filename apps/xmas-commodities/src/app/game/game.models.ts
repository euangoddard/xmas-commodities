export interface Commodity {
  id: number;
  name: string;
  colour: string;
}

export type Commodities = readonly Commodity[];

export interface PriceData {
  prices: readonly number[];
  commodity: Commodity;
}

export type PricesData = readonly PriceData[];
