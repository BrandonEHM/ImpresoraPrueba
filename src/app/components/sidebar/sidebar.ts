import { Component, signal, ChangeDetectionStrategy, ElementRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class Sidebar {
  private readonly elementRef = inject(ElementRef);
  
  protected readonly isSidebarOpen = signal(false);
  protected readonly isDropdownUserMenuOpen = signal(false);

  protected toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  protected toggleDropdownUserMenu(): void {
    this.isDropdownUserMenuOpen.update(open => !open);
  }

  protected onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const dropdownButton = this.elementRef.nativeElement.querySelector('#user-menu-button');
    const dropdownMenu = this.elementRef.nativeElement.querySelector('#user-dropdown');

    // Si el click fue fuera del botón y del menú, cerrar el dropdown
    if (
      this.isDropdownUserMenuOpen() &&
      dropdownButton &&
      dropdownMenu &&
      !dropdownButton.contains(clickedElement) &&
      !dropdownMenu.contains(clickedElement)
    ) {
      this.isDropdownUserMenuOpen.set(false);
    }
  }
}
