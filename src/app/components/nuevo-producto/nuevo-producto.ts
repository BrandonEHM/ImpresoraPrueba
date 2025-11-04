import { afterNextRender, ChangeDetectionStrategy, Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
@Component({
  selector: 'app-nuevo-producto',
  imports: [],
  standalone: true,
  templateUrl: './nuevo-producto.html',
  styleUrls: ['./nuevo-producto.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoProducto {
  constructor() {
    afterNextRender(() => {
      initFlowbite();
    });

  }


  
}



