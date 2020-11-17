import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Commodities, PricesData } from './game/game.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  getPrices(): Observable<PricesData> {
    // TODO: Hit up the real backend eventually
    return of(buildPricesData());
  }
}

let int = 0;
function nextInt(): number {
  return ++int;
}

const COMMODITIES: Commodities = [
  {
    id: nextInt(),
    name: 'Mulled wine',
    colour: '#d50000',
  },
  {
    id: nextInt(),
    name: 'Spruce trees',
    colour: '#1b5e20',
  },
  {
    id: nextInt(),
    name: 'Turkeys',
    colour: '#8d6e63',
  },
  {
    id: nextInt(),
    name: 'Wrapping paper',
    colour: '#aa00ff',
  },
  {
    id: nextInt(),
    name: 'Satsumas',
    colour: '#ff6d00',
  },
  {
    id: nextInt(),
    name: 'Baubles',
    colour: '#ffd600',
  },
  {
    id: nextInt(),
    name: 'Snowmen',
    colour: '#fafafa',
  },
  {
    id: nextInt(),
    name: 'Mittens',
    colour: '#0091ea',
  },
];

// Move to backend API
function buildPricesData(): PricesData {
  return COMMODITIES.map((commodity) => {
    return { commodity, prices: buildPrices() };
  });
}

function buildPrices(): readonly number[] {
  const initialPrice = roundTo2Dp(50 + 300 * Math.random());
  const deltas = Array.from(new Array(100), () => {
    return roundTo2Dp(20 - 40 * Math.random());
  });

  let lastPrice = initialPrice;
  return deltas.map((delta) => {
    const price = Math.max(lastPrice + delta, 1);
    lastPrice = price;
    return price;
  });
}

function roundTo2Dp(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
