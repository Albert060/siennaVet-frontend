import { RouterModule, Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
    { path: "", component: Landing },
    { path: "login", component: Login },
    {
        path: "dashboard",
        component: Layout,
        children: [
            { path: "", component: Dashboard },
            { path: "citas", loadComponent: () => import('./pages/citas/citas').then(m => m.Citas) },
            { path: "vets", loadComponent: () => import('./pages/vets/vets').then(m => m.Vets) }
        ]
    }
];

export const appRoutingModule= RouterModule.forRoot(routes)