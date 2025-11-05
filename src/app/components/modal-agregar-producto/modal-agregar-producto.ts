import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
}

@Component({
  selector: 'app-modal-agregar-producto',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './modal-agregar-producto.html',
  styleUrl: './modal-agregar-producto.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAgregarProducto {
  // Signal para manejar visibilidad del modal
  isOpen = signal<boolean>(false);
  
  // Signal para el nuevo producto
  nuevoProducto = signal<Producto>({ 
    id: 0, 
    nombre: '', 
    precio: 0, 
    descuento: 0 
  });

  // Output para emitir el producto cuando se agrega
  productoAgregado = output<Producto>();

  // Método para abrir el modal
  abrir() {
    this.isOpen.set(true);
  }

  // Método para cerrar el modal
  cerrar() {
    this.isOpen.set(false);
    this.limpiarFormulario();
  }

  // Método para limpiar el formulario
  limpiarFormulario() {
    this.nuevoProducto.set({ 
      id: 0, 
      nombre: '', 
      precio: 0, 
      descuento: 0 
    });
  }

  // Método para agregar producto
  agregarProducto(event: Event) {
    event.preventDefault();
    const nuevo = this.nuevoProducto();

    if (!nuevo.nombre || nuevo.precio <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    // Emitir el producto al componente padre
    this.productoAgregado.emit({ ...nuevo });
    
    // Cerrar modal y limpiar
    this.cerrar();
  }
}