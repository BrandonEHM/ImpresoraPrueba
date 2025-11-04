import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interfaz-editar-productos',
  standalone: true,
  imports: [],
  templateUrl: './interfaz-editar-productos.html',
  styleUrls: ['./interfaz-editar-productos.css']
})
export class InterfazEditarProductos {
  constructor(private router: Router) {}

  navegarNuevoProducto() {
    this.router.navigate(['/nuevo-producto']);
  }

  navegarEditarProducto() {
    this.router.navigate(['/editar-producto']);
  }
}