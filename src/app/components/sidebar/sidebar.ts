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
}




