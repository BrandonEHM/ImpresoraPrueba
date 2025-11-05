import { Routes } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';


import { NuevoProducto } from './components/nuevo-producto/nuevo-producto';
import { EditarProducto } from './components/editar-producto/editar-producto';
import { Paginacion } from './components/paginacion/paginacion';
import { InterfazEditarProductos } from './components/interfaz-editar-productos/interfaz-editar-productos';

import { Productos } from './components/productos/productos';
export const routes: Routes = [
  /*{ path: '', redirectTo: '/interfaz-editar-productos', pathMatch: 'full' },
  { path: 'interfaz-editar-productos', component: InterfazEditarProductos },
  { path: 'nuevo-producto', component: NuevoProducto },
  { path: 'editar-producto', component: EditarProducto },
  { path: 'paginacion', component: Paginacion },*/

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
        path: 'nuevo-producto',
        component: NuevoProducto,
        title: 'NuevoProducto'
      },

      {
        path: 'editar-producto',
        component: EditarProducto,
        title: 'NuevoProducto'
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
