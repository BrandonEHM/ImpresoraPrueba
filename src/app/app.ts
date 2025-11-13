import { Component, signal, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullCalendarModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  protected readonly title = signal('izc-pos-frontend');

  constructor() {
    afterNextRender(() => {
      initFlowbite();
    });
  }
}

