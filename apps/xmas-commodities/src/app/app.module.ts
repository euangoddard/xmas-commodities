import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routing';
import { GameEffects } from './game.effects';
import { HomeComponent } from './home/home.component';
import { AppState, reducer } from './reducers';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy' }),
    StoreModule.forRoot<AppState>({ game: reducer }, {}),
    EffectsModule.forRoot([GameEffects]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
