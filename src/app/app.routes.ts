import { Routes } from '@angular/router';

import { Departments } from './components/departments/departments'
import { Timesheet } from './components/timesheet/timesheet';
import { Analytics } from './components/analytics/analytics';

export const routes: Routes = [
    { path: '', redirectTo: 'departments', pathMatch: 'full' },
    { path: 'departments', component: Departments },
    { path: 'timesheet', component: Timesheet },
    { path: 'analytics', component: Analytics }
];
