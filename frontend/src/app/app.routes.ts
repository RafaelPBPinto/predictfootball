import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'matches',
        pathMatch: 'full'
    },
    {
        path: 'matches',
        loadComponent: () => import('./features/matches/matches').then(m => m.Matches)
    },
    {
        path: 'match/:id',
        loadComponent: () => import('./features/match-detail/match-detail').then(m => m.MatchDetail)
    },
    {
        path: 'standings',
        loadComponent: () => import('./features/standings/standings').then(m => m.Standings)
    },
    {
        path: '**',
        redirectTo: 'matches'
    }
];
