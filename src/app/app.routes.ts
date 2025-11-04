import { Routes } from '@angular/router';
import { NuevoProducto } from './components/nuevo-producto/nuevo-producto';
import { EditarProducto } from './components/editar-producto/editar-producto';
import { Paginacion } from './components/paginacion/paginacion';
import { InterfazEditarProductos } from './components/interfaz-editar-productos/interfaz-editar-productos';

export const routes: Routes = [
  { path: '', redirectTo: '/interfaz-editar-productos', pathMatch: 'full' },
  { path: 'interfaz-editar-productos', component: InterfazEditarProductos },
  { path: 'nuevo-producto', component: NuevoProducto },
  { path: 'editar-producto', component: EditarProducto },
  { path: 'paginacion', component: Paginacion },
];
