import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  COMMISSION,
  HISTORIC_VALUES,
  INITIAL_CASH_BALANCE,
} from '../game/game.constants';

@Component({
  selector: 'xmas-commodities-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly initialCash = INITIAL_CASH_BALANCE;
  readonly commission = COMMISSION;
  readonly historicPoints = HISTORIC_VALUES;
}
