import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'xmas-commodities-spark-line',
  templateUrl: './spark-line.component.html',
  styleUrls: ['./spark-line.component.scss'],
})
export class SparkLineComponent implements OnChanges {
  @Input() prices: readonly number[];
  @Input() size: number;

  fillData: string;
  lineData: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.size && this.prices) {
      this.setData(this.prices.slice(-1 * this.size));
    }
  }

  private setData(prices: readonly number[]): void {
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const pricesCount = prices.length;

    const sparkParts = [
      ...prices.map((price, index) => {
        const x = index;
        const y =
          100 - (10 + (90 * (price - minPrice)) / (maxPrice - minPrice));
        const instruction = index === 0 ? 'M' : 'L';
        return `${instruction} ${x},${y.toFixed(4)}`;
      }),
    ];

    this.lineData = sparkParts.join(' ');
    this.fillData = [
      ...sparkParts,
      `L ${pricesCount - 1}, 100`,
      'L 0, 100',
      'Z',
    ].join(' ');
  }
}
