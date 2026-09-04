import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Simulator } from './pages/simulator/simulator';
import { About } from './pages/about/about';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'simulator', component: Simulator },
  { path: 'about', component: About },
  { path: '**', redirectTo: '' },
];
