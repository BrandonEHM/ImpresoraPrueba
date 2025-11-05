import { Routes } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { Login } from './components/login/login';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        title: 'Iniciar sesión'
    },
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
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'login' // para rutas inexistentes
    }
];