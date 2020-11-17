import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeComponent } from './change/change.component';
import { CommodityComponent } from './commodity/commodity.component';
import { GameComponent } from './game.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { SparkLineComponent } from './spark-line/spark-line.component';
import { TradeComponent } from './trade/trade.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: GameComponent }]),
  ],
  declarations: [
    GameComponent,
    CommodityComponent,
    SparkLineComponent,
    HoldingsComponent,
    ChangeComponent,
    TradeComponent,
  ],
})
export class GameModule {}
