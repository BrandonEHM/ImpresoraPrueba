import { Routes } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { Login } from './components/login/login';

import { Paginacion } from './components/paginacion/paginacion';
import { Productos } from './components/productos/productos';
import { MuseosList } from './components/museos/museos-list/museos-list';
import { BoletosList } from './components/boletos/boletos-list/boletos-list';

import { ServiciosList } from './components/servicios/servicios-list/servicios-list';

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
      },
      {
        path: 'productos',
        component: Productos,
        title: 'Productos'
      },

      {
        path: 'paginacion',
        component: Paginacion,
        title: 'Paginacion'
      },
      {
        path: 'museos',
        component: MuseosList,
        title: 'Museos'
      },
      {

        path: 'boletos',
        component: BoletosList,
        title: 'Boletos'
      },
      {
        path: 'servicios',
        component: ServiciosList,
        title: 'Servicios'
      },
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      },
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



