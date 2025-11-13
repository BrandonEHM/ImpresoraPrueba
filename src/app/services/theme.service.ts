import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isDarkMode = signal(false); // Inicia en modo claro

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Lee la preferencia guardada o usa modo claro por defecto
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode.set(savedTheme === 'dark');
      
      // Aplica el tema inicial
      this.applyTheme();

      // Efecto para aplicar cambios de tema
      effect(() => {
        this.applyTheme();
      });
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
  }

  private applyTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      
      if (this.isDarkMode()) {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }
}
