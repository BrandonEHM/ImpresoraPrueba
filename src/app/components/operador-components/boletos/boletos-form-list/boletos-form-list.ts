import { Component, signal, computed, inject } from '@angular/core';

import { Paginacion } from "../../../paginacion/paginacion";
import { initFlowbite } from 'flowbite';
import { ExportTotalVisitantes } from '../boletos-formulario/boletos-formulario';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
interface Boleto {
  id: number;
  nombre: string;
  price: number;
  discount: number;

}

@Component({
  selector: 'app-boletos-form-list',
  imports: [Paginacion, ReactiveFormsModule],
  templateUrl: './boletos-form-list.html',
  styleUrls: ['./boletos-form-list.css'],
})
export class BoletosFormList {
  private formBuilder = inject(FormBuilder);

  // Signal para almacenar el monto ingresado
  montoIngresado = signal<number>(0);
  // Formulario para el ingreso
  FormIngreso = this.formBuilder.group({
    ingreso: [null, [Validators.pattern(/^\d*\.?\d{0,2}$/)]],
  });


  boletos = signal<Boleto[]>([
    { id: 1, nombre: 'Normal', price: 76, discount: 0 },
    { id: 2, nombre: 'Niños', price: 76, discount: 100 },
    { id: 3, nombre: 'Estudiantes', price: 76, discount: 50 },
    { id: 4, nombre: 'Tercera edad', price: 76, discount: 100 },
    { id: 5, nombre: 'Vip', price: 76, discount: 100 },
  ]);

  cantidad = signal<{ [id: number]: number }>({});
  maxBoletos = signal(ExportTotalVisitantes);

  // Computed signals para calcular totales automáticamente (se usa computed en vez de signal)
  // computed para calculos dinamoicos para actualizar autom ya que depend de otros reactivos
  //Sumar el precio 
  totalBoletos = computed(() => {
    let total = 0;
    for (const boleto of this.boletos()) {
      total += this.cantidad()[boleto.id] || 0;
    }
    return total;
  });

  totalmonto = computed(() => {
    let totalDinero = 0;
    for (const boleto of this.boletos()) {
      const cantidadselectboletos = this.cantidad()[boleto.id] || 0;
      const precioFinal = boleto.price - (boleto.price * boleto.discount / 100);
      totalDinero += precioFinal * cantidadselectboletos;
    }
    return totalDinero;
  });

  // Computed para saber si se alcanzó el máximo
  maxAlcanzado = computed(() => this.totalBoletos() >= this.maxBoletos());

  constructor() {
    // Actualizar maxBoletos cuando cambie ExportTotalVisitantes
    setInterval(() => {
      if (this.maxBoletos() !== ExportTotalVisitantes) {
        this.maxBoletos.set(ExportTotalVisitantes);
      }
    }, 100);
  }

  incrementar(boleto: Boleto) {
    // Solo incrementar si no se ha alcanzado el máximo total
    if (this.totalBoletos() < this.maxBoletos()) {
      const actual = this.cantidad()[boleto.id] || 0;
      this.cantidad.update(val => ({
        ...val,
        [boleto.id]: actual + 1
      }));
    }
  }

  decrementar(boleto: Boleto) {
    const actual = this.cantidad()[boleto.id] || 0;
    if (actual > 0) {
      this.cantidad.update(val => ({
        ...val,
        [boleto.id]: actual - 1
      }));
    }
  }

  // Método para deshabilitar botones especificos 
  botonIncrementarDeshabilitado(boleto: Boleto): boolean {
    return this.maxAlcanzado();
  }

  botonDecrementarDeshabilitado(boleto: Boleto): boolean {
    const actual = this.cantidad()[boleto.id] || 0;
    return actual === 0;
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