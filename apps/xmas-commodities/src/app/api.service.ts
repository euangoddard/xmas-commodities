import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { PricesData } from './game/game.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly httpClient: HttpClient) {}

  getPrices(): Observable<PricesData> {
    return this.httpClient
      .get<{ data: PricesData }>('/.netlify/functions/prices')
      .pipe(pluck('data'));
  }
}
