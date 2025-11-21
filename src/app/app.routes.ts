import { Routes } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { Login } from './components/login/login';

import { Paginacion } from './components/paginacion/paginacion';
import { Productos } from './components/productos/productos';
import { MuseosList } from './components/museos/museos-list/museos-list';
import { BoletosList } from './components/boletos/boletos-list/boletos-list';

import { ServiciosList } from './components/servicios/servicios-list/servicios-list';
import { FormularioBase } from './components/informes/formulario-base/formulario-base';
import { Agenda } from './components/agenda/agenda';
import { BoletosFormulario } from './components/operador-components/boletos/boletos-formulario/boletos-formulario';
import { BoletosFormList } from './components/operador-components/boletos/boletos-form-list/boletos-form-list';
import { ProductosListOp } from './components/operador-components/boletos/productos-list-op/productos-list-op';
import { SidebarOperador } from './components/operador-components/sidebar/sidebar';


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
        path: 'informes',
        component: FormularioBase,
        title: 'Informes'
      },
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      },

      {
        path: 'agenda',
        component: Agenda,
        title: 'Agenda'
      },
      {
        path: '',
        redirectTo: 'agenda',
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
    path: 'operador',
    component: SidebarOperador,
    title: 'Operador',
    
children: [
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      },

      {
        path: 'productos',
        component: ProductosListOp,
        title: 'Productos'
      },

      {
        path: 'servicios',
        component: ServiciosList,
        title: 'Servicios'
      },
      {
        path: 'visitantes',
        component: BoletosFormulario,
        title: 'FormVisitantes'
      },

      {
        path: 'boletos',
        component: BoletosFormList,
        title: 'Boletos'
      },
      /*{
        path: 'agendar',
        component: ,
        title: 'Agendar'
      },*/


    ]
  },

  {
    path: '**',
    redirectTo: 'login' // para rutas inexistentes
  }
];









