import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COMMISSION, HISTORIC_VALUES } from '../game/game.constants';

@Component({
  selector: 'xmas-commodities-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly commission = COMMISSION;
  readonly historic_points = HISTORIC_VALUES;
}
