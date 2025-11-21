import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export let ExportTotalVisitantes = 0;
@Component({
  selector: 'app-boletos-formulario',
  imports: [ReactiveFormsModule, CommonModule, JsonPipe, RouterModule],
  templateUrl: './boletos-formulario.html',
  styleUrl: './boletos-formulario.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BoletosFormulario {

  constructor(private router: Router) { }
  private formBuilder = inject(FormBuilder);

  // Formulario para crear un nuevo visitante
  FormVisitante = this.formBuilder.group({
    nombre: ['', Validators.required],
    edad: [null, [Validators.required, Validators.min(1), Validators.max(150)]],
    cp: [null, [Validators.required, Validators.maxLength(5), Validators.pattern(/^\d{0,5}$/)]],
    estado: ['', Validators.required],
    pais: ['', Validators.required],
    grupo: ['No', Validators.required],
    hombre: [0, [Validators.max(1000)]],
    mujer: [0, [Validators.max(1000)]],
    otrogenero: [0, [Validators.max(1000)]],
    totalvisitantes: [{ value: 0, disabled: true }],
    fecha: [{ value: new Date().toLocaleDateString(), disabled: true }], // ← Fecha automática
  });

  //Logica para el grupo
  ngOnInit() {
    this.FormVisitante.valueChanges.subscribe(val => {
      const esGrupo = val.grupo === 'Sí';
      const hombre = Number(val.hombre) || 0;
      const mujer = Number(val.mujer) || 0;
      const otre = Number(val.otrogenero) || 0;

      if (!esGrupo) {
        // Limitar cada campo a máximo 1
        if (hombre > 1) {
          this.FormVisitante.patchValue({ hombre: 1 }, { emitEvent: false });
          return; // Salir para evitar conflictos
        }
        if (mujer > 1) {
          this.FormVisitante.patchValue({ mujer: 1 }, { emitEvent: false });
          return;
        }
        if (otre > 1) {
          this.FormVisitante.patchValue({ otrogenero: 1 }, { emitEvent: false });
          return;
        }

        // Manejar habilitación/deshabilitación según el campo seleccionado
        if (hombre === 1) {
          this.FormVisitante.get('mujer')?.disable({ emitEvent: false });
          this.FormVisitante.get('otrogenero')?.disable({ emitEvent: false });
          this.FormVisitante.patchValue({ mujer: 0, otrogenero: 0 }, { emitEvent: false });
        } else if (mujer === 1) {
          this.FormVisitante.get('hombre')?.disable({ emitEvent: false });
          this.FormVisitante.get('otrogenero')?.disable({ emitEvent: false });
          this.FormVisitante.patchValue({ hombre: 0, otrogenero: 0 }, { emitEvent: false });
        } else if (otre === 1) {
          this.FormVisitante.get('hombre')?.disable({ emitEvent: false });
          this.FormVisitante.get('mujer')?.disable({ emitEvent: false });
          this.FormVisitante.patchValue({ hombre: 0, mujer: 0 }, { emitEvent: false });
        } else {
          // Si todos están en 0, habilitar todos los campos
          this.FormVisitante.get('hombre')?.enable({ emitEvent: false });
          this.FormVisitante.get('mujer')?.enable({ emitEvent: false });
          this.FormVisitante.get('otrogenero')?.enable({ emitEvent: false });
        }
      } else {
        // Si es grupo, habilitar todos los campos
        this.FormVisitante.get('hombre')?.enable({ emitEvent: false });
        this.FormVisitante.get('mujer')?.enable({ emitEvent: false });
        this.FormVisitante.get('otrogenero')?.enable({ emitEvent: false });
      }

      // Calcular total usando getRawValue() para incluir campos deshabilitados
      const valores = this.FormVisitante.getRawValue();
      const total = (Number(valores.hombre) || 0) + (Number(valores.mujer) || 0) + (Number(valores.otrogenero) || 0);
      this.FormVisitante.patchValue({ totalvisitantes: total }, { emitEvent: false });

      ExportTotalVisitantes= total;
      // Actualizar total de visitantes
      /*const total = hombre + mujer + otre;
      this.FormVisitante.patchValue({ totalvisitantes: total }, { emitEvent: false });

*/
    });
  }
}


