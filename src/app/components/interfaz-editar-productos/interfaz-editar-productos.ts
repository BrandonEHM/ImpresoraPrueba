import { Component, ChangeDetectionStrategy, afterNextRender, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interfaz-editar-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interfaz-editar-productos.html',
  styleUrls: ['./interfaz-editar-productos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfazEditarProductos {
  constructor(private router: Router) { }

  navegarNuevoProducto() {
    this.router.navigate(['/admin/nuevo-producto']);
  }

  navegarEditarProducto() {
    this.router.navigate(['/admin/editar-producto']);
  }

}