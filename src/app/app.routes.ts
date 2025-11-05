import { Routes } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';

import { Paginacion } from './components/paginacion/paginacion';
import { Productos } from './components/productos/productos';
export const routes: Routes = [

  {
    path: 'admin',
    component: Sidebar,
    title: 'Admin',
    children: [
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
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full'
  }
];
