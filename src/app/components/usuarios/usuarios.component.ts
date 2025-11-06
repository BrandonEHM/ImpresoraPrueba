import { Component, ChangeDetectionStrategy, afterNextRender, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { Register } from '../register/register';

interface Usuario {
  id: number;
  nombre: string;
  idNumerico: string;
  activo: boolean;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, Register],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosComponent {
  usuarios = signal<Usuario[]>([
    { id: 1, nombre: 'Usuario1', idNumerico: '1234560', activo: true },
    { id: 2, nombre: 'Usuario2', idNumerico: '1234561', activo: true },
    { id: 3, nombre: 'Usuario3', idNumerico: '1234562', activo: true },
    { id: 4, nombre: 'Usuario4', idNumerico: '1234563', activo: true },
  ]);

  usuarioSeleccionado = signal<Usuario | null>(null);
  usuarioEditar = signal<Usuario | null>(null);

  constructor() {
    afterNextRender(() => {
      initFlowbite();
    });
  }

  seleccionarParaEliminar(usuario: Usuario) {
    this.usuarioSeleccionado.set(usuario);
  }

  seleccionarParaEditar(usuario: Usuario) {
    this.usuarioEditar.set({ ...usuario });
  }

  confirmarEliminar() {
    const usuario = this.usuarioSeleccionado();
    if (usuario) {
      this.usuarios.update(lista => lista.filter(u => u.id !== usuario.id));
      this.usuarioSeleccionado.set(null);
    }
  }

  guardarEdicion() {
    const usuarioEditado = this.usuarioEditar();
    if (usuarioEditado) {
      this.usuarios.update(lista =>
        lista.map(u => u.id === usuarioEditado.id ? usuarioEditado : u)
      );
      this.usuarioEditar.set(null);
    }
  }

  cancelarEdicion() {
    this.usuarioEditar.set(null);
  }

  cancelarEliminacion() {
    this.usuarioSeleccionado.set(null);
  }
}