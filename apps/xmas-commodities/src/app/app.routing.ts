import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const ROUTES: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'play',
    loadChildren: () =>
      import('./game/game.module').then((module) => module.GameModule),
  },
  { path: '**', redirectTo: '/' },
];
