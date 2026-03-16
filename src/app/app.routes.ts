import { Routes } from '@angular/router';

import { DefaultLayoutComponent } from './core/layout/default-layout/default-layout/default-layout.component';
import { LoginLayoutComponent } from './core/layout/login-layout/login-layout.component';
import { LogInComponent } from '@features/auth/login/login.component';
import { RegisterComponent } from '@features/auth/register/register.component';
import { LotsMainPageComponent } from '@features/lots/pages/lots-main-page/lots-main-page.component';
import { AllLotsPageComponent } from '@features/lots/pages/all-lots-page/all-lots-page.component';
import { AllTransactionsPageComponent } from '@features/lots/pages/all-transactions-page/all-transactions-page.component';
import { UploadLotPageComponent } from '@features/lots/pages/upload-lot-page/upload-lot-page.component';
import { AwardListPageComponent } from '@features/awards/pages/award-list-page/award-list-page.component';
import { GiveawayListPageComponent } from '@features/giveaways/pages/giveaway-list-page/giveaway-list-page.component';
import { GiveawayDetailPageComponent } from '@features/giveaways/pages/giveaway-detail-page/giveaway-detail-page.component';
import { GiveawayCreatePageComponent } from '@features/giveaways/pages/giveaway-create-page/giveaway-create-page.component';
import { ReportTransactionsPageComponent } from '@features/reports/pages/report-transactions-page/report-transactions-page.component';
import { ReportWinnersPageComponent } from '@features/reports/pages/report-winners-page/report-winners-page.component';
import { ReportMainPageComponent } from '@features/reports/pages/report-main-page/report-main-page.component';
import { authGuard } from './core/guards/auth.guard';

// Rutas protegidas para el layout principal
const protectedRoutes = [
    { path: 'awards', component: AwardListPageComponent },
    { path: 'lots', component: LotsMainPageComponent },
    { path: 'lots/all', component: AllLotsPageComponent },
    { path: 'lots/transactions', component: AllTransactionsPageComponent },
    { path: 'lots/upload', component: UploadLotPageComponent },
    { path: 'giveaways', component: GiveawayListPageComponent },
    { path: 'giveaways/new', component: GiveawayCreatePageComponent },
    { path: 'giveaways/:id', component: GiveawayDetailPageComponent },
    { path: 'reports', component: ReportMainPageComponent },
    { path: 'reports/transactions', component: ReportTransactionsPageComponent },
    { path: 'reports/winners', component: ReportWinnersPageComponent },
].map(route => ({ ...route }));

// Rutas de autenticación
const authRoutes = [
    { path: 'log-in', component: LogInComponent },
    { path: 'register', component: RegisterComponent }
];


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'lots',
        pathMatch: 'full'
    },
    {
        path: '',
        component: DefaultLayoutComponent,
        canActivate: [authGuard],
        children: protectedRoutes
    },
    {
        path: 'auth',
        component: LoginLayoutComponent,
        children: authRoutes
    },
    { path: '**', redirectTo: 'auth/log-in' },
];
