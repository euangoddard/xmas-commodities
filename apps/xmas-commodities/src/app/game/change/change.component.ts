import { Component, Input } from '@angular/core';

@Component({
  selector: 'xmas-commodities-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.scss'],
})
export class ChangeComponent {
  @Input() change: number;

  get changeClass(): string {
    if (0 < this.change) {
      return 'positive';
    } else if (this.change < 0) {
      return 'negative';
    } else {
      return 'unchanged';
    }
  }
}
