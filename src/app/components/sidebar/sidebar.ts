import { Component, ChangeDetectionStrategy, afterNextRender} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {

  constructor() {
    afterNextRender(() => initFlowbite());
  }
}
