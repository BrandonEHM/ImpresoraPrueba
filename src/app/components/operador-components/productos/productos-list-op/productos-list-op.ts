//productos-list-op.ts
import { Component, ChangeDetectionStrategy, afterNextRender, signal, computed, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';

import { ProductosAdd } from '../productos-add/productos-add';
import { ProductosService } from '../../../../services/productos/productos.service';
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
}

@Component({
  selector: 'app-productos-list-op',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProductosAdd],
  templateUrl: './productos-list-op.html',
  styleUrl: './productos-list-op.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosListOp {

  //Inyectar el servicio
  private productosService = inject(ProductosService);



  constructor() {
    afterNextRender(() => {
      initFlowbite();
    });
  }



  private formBuilder = inject(FormBuilder);
  // Signal para almacenar el monto ingresado
  montoIngresado = signal<number>(0);
  // Formulario para el ingreso
  FormIngreso = this.formBuilder.group({
    ingreso: [null, [Validators.pattern(/^\d*\.?\d{0,2}$/)]],
  });


  // Obtener productos agregados desde el servicio
  productos = computed(() => this.productosService.productosAgregados());



  //------------------------SOLO FILTRADO POR BUSQUEDA---------------------
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
  //---------------------------------------------------------------------------------------------

  // Obtener cantidades desde el servicio
  cantidad = computed(() => this.productosService.cantidades());


  totalProductos = computed(() => {
    let total = 0;
    for (const producto of this.productos()) {
      total += this.cantidad()[producto.id] || 0;
    }
    return total;
  });

  totalmonto = computed(() => {
    let totalDinero = 0;
    for (const producto of this.productos()) {
      const cantidadselectproductos = this.cantidad()[producto.id] || 0;
      const precioFinal = producto.precio - (producto.precio * producto.descuento / 100);
      totalDinero += precioFinal * cantidadselectproductos;
    }
    return totalDinero;
  });

// Métodos actualizados para usar el servicio
  incrementar(producto: Producto) {
    this.productosService.incrementarCantidad(producto.id);
  }

  decrementar(producto: Producto) {
    this.productosService.decrementarCantidad(producto.id);
  }

  totalcambio = computed(() => {
    const ingreso = this.montoIngresado();
    const total = this.totalmonto();
    return ingreso > 0 ? ingreso - total : 0;
  });

  ngOnInit() {
    this.FormIngreso.get('ingreso')?.valueChanges.subscribe(valor => {
      const monto = Number(valor) || 0;
      this.montoIngresado.set(monto);
    });
  }

}
