import { Component, signal, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
<<<<<<< HEAD
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullCalendarModule],
=======
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
>>>>>>> 8a9a00c297f8bc33ff893b29993d93258bc2fb7a
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  protected readonly title = signal('izc-pos-frontend');
  private readonly themeService = inject(ThemeService); // Inicializa el servicio

  constructor() {
    afterNextRender(() => {
      initFlowbite();
    });
  }
}

