import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  imports: [],
  standalone: true,
  templateUrl: './paginacion.html',
  styleUrls: ['./paginacion.css'],
})
export class Paginacion {

 @Input() TotalResultado: number = 0;
  @Input() Solo10: number = 10;
  @Input() PagActual: number = 1;

  get totalPagina(): number {
    return Math.ceil(this.TotalResultado / this.Solo10);
  }

  get PrimerR(): number {
    return this.TotalResultado === 0 ? 0 : (this.PagActual - 1) * this.Solo10 + 1;
  }

  get LimA10(): number {
    const end = this.PagActual * this.Solo10;
    return end > this.TotalResultado ? this.TotalResultado : end;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPagina }, (_, i) => i + 1);
  }
}