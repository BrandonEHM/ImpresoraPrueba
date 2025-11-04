import { Routes } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: Sidebar,
        title: 'Admin',
        children: [
            {
                path: 'usuarios',
                component: UsuariosComponent,
                title: 'Usuarios'
            },
            {
                path: '',
                redirectTo: 'usuarios',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/admin',
        pathMatch: 'full'
    }
];