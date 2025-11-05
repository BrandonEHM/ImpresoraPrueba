/*
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  constructor(private router: Router) { }

  navegarEditarCrearProducto() {
    this.router.navigate(['/interfaz-editar-productos']);
  }
  navegarPaginacion() {
    this.router.navigate(['/paginacion']);
  }
}
*/
import { Component, ChangeDetectionStrategy, afterNextRender} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {

  constructor() {
    afterNextRender(() => initFlowbite());
  }
}
