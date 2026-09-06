import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Simulator } from './pages/simulator/simulator';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { History } from './pages/history/history';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'simulator', component: Simulator },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'history', component: History, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
