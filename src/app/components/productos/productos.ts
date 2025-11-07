import { Component, ChangeDetectionStrategy, afterNextRender, signal, computed, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { ModalAgregarProducto } from '../modal-agregar-producto/modal-agregar-producto';
import { Paginacion } from '../paginacion/paginacion';
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalAgregarProducto, Paginacion],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Productos {
  // ViewChild para acceder al modal
  modalAgregar = viewChild<ModalAgregarProducto>('modalAgregar');

  constructor() {
    afterNextRender(() => {
      initFlowbite();
    });
  }

  productos = signal<Producto[]>([
    { id: 1, nombre: 'Café', precio: 20, descuento: 0 },
    { id: 2, nombre: 'Agua', precio: 20, descuento: 10 },
    { id: 3, nombre: 'Collar', precio: 150, descuento: 0 },
  ]);

  // Signal para el manejar busquedas
  Busqueda = signal<string>('');

  // Computed para filtrar productos segun la busqueda
  productosFiltrados = computed(() => {
    const termino = this.Busqueda().toLowerCase().trim();
    if (!termino) return this.productos();
    return this.productos().filter(producto =>
      producto.id.toString().includes(termino) ||
      producto.nombre.toLowerCase().includes(termino) ||
      producto.precio.toString().includes(termino) ||
      producto.descuento.toString().includes(termino)
    );
  });

  productoEditado = signal<Producto>({ id: 0, nombre: '', precio: 0, descuento: 0 });
  productoAEliminar = signal<Producto | null>(null);

  // Metodo para actualizar el término de búsqueda
  actualizarBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;
    this.Busqueda.set(input.value);
  }

  // Encontrar el ID mas alto para asignar uno nuevo
  obtenerSiguienteId(): number {
    const productos = this.productos();
    return productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  }

  // Método para abrir el modal de agregar
  abrirModalAgregar() {
    this.modalAgregar()?.abrir();
  }

  // Método llamado cuando se agrega un producto desde el modal
  onProductoAgregado(producto: Producto) {
    const productoConId = { ...producto, id: this.obtenerSiguienteId() };
    this.productos.update(arr => [...arr, productoConId]);
  }

  seleccionarParaEditar(producto: Producto) {
    this.productoEditado.set({ ...producto });
  }

  // Funcion para Editar Producto
  guardarCambios(event: Event) {
    event.preventDefault();
    const editado = this.productoEditado();

    if (!editado.nombre || editado.precio <= 0) {
      alert('Por favor completa todos los campos');
      return;
    }

    const lista = this.productos().map(p =>
      p.id === editado.id ? editado : p
    );
    this.productos.set(lista);
    this.cerrarModalConClick('edit-modal');
  }

  seleccionarParaEliminar(producto: Producto) {
    this.productoAEliminar.set(producto);
  }

  // Funcion para Eliminar Producto
  eliminarProducto() {
    const producto = this.productoAEliminar();
    if (!producto) return;

    this.productos.set(this.productos().filter(p => p.id !== producto.id));
    this.cerrarModalConClick('delete-modal');
  }

  cerrarModalConClick(id: string) {
    const modal = document.getElementById(id);
    if (!modal) return;

    const closeButton = modal.querySelector('[data-modal-hide="' + id + '"]') ||
      modal.querySelector('[data-modal-toggle="' + id + '"]');

    if (closeButton) {
      (closeButton as HTMLElement).click();
    }
  }

  // Obtener resultados 
  /* totalProductos: number = 0;
   Solo10: number = 0;
 
   actualizarTotalProductos() {
     this.totalProductos = this.obtenerSiguienteId() - 1;
     this.Solo10 = this.totalProductos > 5 ? 5 : this.totalProductos;
   }
 
   ngAfterViewChecked() {
     this.actualizarTotalProductos();
   }*/
}