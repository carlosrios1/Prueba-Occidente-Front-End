import { Routes } from '@angular/router';

import { DefaultLayoutComponent } from './core/layout/default-layout/default-layout/default-layout.component';
import { LoginLayoutComponent } from './core/layout/login-layout/login-layout.component';
import { Component } from 'lucide-angular';
import { TechListPageComponent } from '@features/technologies/pages/tech-list-page/tech-list-page.component';
import { TechDetailPageComponent } from '@features/technologies/pages/tech-detail-page/tech-detail-page.component';
import { LogInComponent } from '@features/auth/login/login.component';

// Rutas protegidas para el layout principal
const protectedRoutes = [
    { path: 'technologies', component: TechListPageComponent },
    { path: 'technologies/:name', component: TechDetailPageComponent },
].map(route => ({ ...route }));

// Rutas de autenticación
const authRoutes = [
    { path: 'log-in', component: LogInComponent }
];


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'technologies',
        pathMatch: 'full'
    },
    {
        path: '',
        component: DefaultLayoutComponent,
        children: protectedRoutes
    },
    {
        path: 'auth',
        component: LoginLayoutComponent,
        children: authRoutes
    },
    // { path: 'proximamente', component: ComingSoonComponent },
    // { path: 'error', component: ErrorPageComponent },
    // { path: '**', component: NotFoundComponent },
];
