import { Routes } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';

export const routes: Routes = [
    {
        path: 'admin',
        component: Sidebar,
        title: 'Admin'
    }
];
