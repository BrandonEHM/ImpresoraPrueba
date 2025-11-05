import { Component, ChangeDetectionStrategy, afterNextRender, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Productos {
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

  //Singnal para el manejar busquedas
  Busqueda = signal<string>('');
  //Computed para filtrar productos segun la busqueda
  productosFiltrados = computed(() => {
    const termino = this.Busqueda().toLowerCase().trim();
    if (!termino) return this.productos(); // Si no hay busqueda debera mostrar todo
    // Filtrar productos que coincidan con el termino de busqueda
    return this.productos().filter(producto =>
      producto.id.toString().includes(termino) ||
      producto.nombre.toLowerCase().includes(termino) ||
      producto.precio.toString().includes(termino) ||
      producto.descuento.toString().includes(termino)
    );
  });

  nuevoProducto = signal<Producto>({ id: 0, nombre: '', precio: 0, descuento: 0 });
  productoEditado = signal<Producto>({ id: 0, nombre: '', precio: 0, descuento: 0 });
  productoAEliminar = signal<Producto | null>(null);


  //Metodo para actualizar el término de búsqueda
  actualizarBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;
    this.Busqueda.set(input.value);
  }

  //Encontrar el ID mas alto para asignar uno nuevo
  obtenerSiguienteId(): number {
    const productos = this.productos();
    return productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  }


  // Funcion para Agregar Producto
  agregarProducto(event: Event) {
    event.preventDefault();
    const nuevo = this.nuevoProducto();

    if (!nuevo.nombre || nuevo.precio <= 0) {
      alert('Por favor completa todos los campos');
      return;
    }
    // Asignar un ID unico al nuevo producto usando la funcion obtenerSiguienteId
    const productoConId = { ...nuevo, id: this.obtenerSiguienteId() };
    this.productos.update(arr => [...arr, productoConId]);
    this.nuevoProducto.set({ id: 0, nombre: '', precio: 0, descuento: 0 });
    this.cerrarModalConClick('crud-modal');
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
  // ------------------------------------------------------------------------------
  // === NUEVA FUNCIÓN: SIMULA CLICK EN EL BOTÓN DE CERRAR ===
  cerrarModalConClick(id: string) {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Buscar el botón de cerrar dentro del modal
    const closeButton = modal.querySelector('[data-modal-hide="' + id + '"]') ||
      modal.querySelector('[data-modal-toggle="' + id + '"]');

    if (closeButton) {
      // Simular click en el botón de cerrar
      (closeButton as HTMLElement).click();
    }
  }


  //Obtener resultados 
  totalProductos: number = 0;
  Solo10: number = 0;

  actualizarTotalProductos() {
    this.totalProductos = this.obtenerSiguienteId() - 1;
    //Solo mostrar hasta 5 resultados
    this.Solo10 = this.totalProductos > 5 ? 5 : this.totalProductos;
  }
  // Llamar a actualizarTotalProductos cada vez que productos cambie
  ngAfterViewChecked() {
    this.actualizarTotalProductos();
  }
}