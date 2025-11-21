import { Component, ChangeDetectionStrategy, afterNextRender, signal, computed, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { Paginacion } from '../../../paginacion/paginacion';


interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
}

@Component({
  selector: 'app-productos-list-op',
  imports: [CommonModule, FormsModule, Paginacion, ReactiveFormsModule],
  templateUrl: './productos-list-op.html',
  styleUrl: './productos-list-op.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosListOp {


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



  productos = signal<Producto[]>([
    { id: 1, nombre: 'Café', precio: 20, descuento: 0 },
    { id: 2, nombre: 'Agua', precio: 20, descuento: 10 },
    { id: 3, nombre: 'Collar', precio: 150, descuento: 0 },
  ]);

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
  cantidad = signal<{ [id: number]: number }>({});


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


  incrementar(producto: Producto) {
    // Solo incrementar si no se ha alcanzado el máximo total

    const actual = this.cantidad()[producto.id] || 0;
    this.cantidad.update(val => ({
      ...val,
      [producto.id]: actual + 1
    }));

  }

  decrementar(producto: Producto) {
    const actual = this.cantidad()[producto.id] || 0;
    if (actual > 0) {
      this.cantidad.update(val => ({
        ...val,
        [producto.id]: actual - 1
      }));
    }
  }

  
  //Herramienta para calcular cambio 
  // Computed para calcular el cambio
  totalcambio = computed(() => {
    const ingreso = this.montoIngresado();
    const total = this.totalmonto();
    return ingreso > 0 ? ingreso - total : 0;
  });

  ngOnInit() {
    // Suscribirse a cambios en el formulario para actualizar el signal
    this.FormIngreso.get('ingreso')?.valueChanges.subscribe(valor => {
      const monto = Number(valor) || 0;
      this.montoIngresado.set(monto);
    });

  }

}
