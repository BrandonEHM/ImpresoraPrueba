import { Component, signal, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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

