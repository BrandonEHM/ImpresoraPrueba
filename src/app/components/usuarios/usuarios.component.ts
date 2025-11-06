import { Component, ChangeDetectionStrategy, ChangeDetectorRef, afterNextRender, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite, Modal } from 'flowbite';

interface Usuario {
  id: number;
  nombre: string;
  idNumerico: string;
  correo: string;
  activo: boolean;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosComponent {
  usuarios = signal<Usuario[]>([
    { id: 1, nombre: 'Usuario1', idNumerico: '1234560', correo: 'usuario1@gmail.com', activo: true },
    { id: 2, nombre: 'Usuario2', idNumerico: '1234561', correo: 'usuario2@hotmail.com', activo: true },
    { id: 3, nombre: 'Usuario3', idNumerico: '1234562', correo: 'usuario3@yahoo.com', activo: true },
    { id: 4, nombre: 'Usuario4', idNumerico: '1234563', correo: 'usuario4@cozcyt.com', activo: true },
  ]);

  usuarioSeleccionado = signal<Usuario | null>(null);
  usuarioEditar = signal<Usuario | null>(null);

  private editModal: Modal | null = null;
  private deleteModal: Modal | null = null;

  constructor(private cd: ChangeDetectorRef) {
    afterNextRender(() => {
      initFlowbite();

      const editEl = document.getElementById('edit-modal');
      const deleteEl = document.getElementById('delete-modal');

      if (editEl) this.editModal = new Modal(editEl);
      if (deleteEl) this.deleteModal = new Modal(deleteEl);
    });
  }

  // ---------- Helpers ----------
  private removeBackdrop() {
    // Flowbite usa .modal-backdrop en algunas versiones; borramos cualquier overlay que quede
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    // También quitamos la clase que pueda bloquear scroll/body
    document.body.classList.remove('modal-open');
  }

  // ---------- Edit flow ----------
  abrirEdicion(usuario: Usuario) {
    this.usuarioEditar.set({ ...usuario });
    this.cd.detectChanges();

    if (!this.editModal) {
      const el = document.getElementById('edit-modal');
      if (el) this.editModal = new Modal(el);
    }
    this.editModal?.show();
    this.removeBackdrop();
  }

  guardarEdicion() {
    const usuarioEditado = this.usuarioEditar();
    if (usuarioEditado) {
      this.usuarios.update(lista =>
        lista.map(u => (u.id === usuarioEditado.id ? usuarioEditado : u))
      );
      this.usuarioEditar.set(null);
    }
    // cerrar modal visualmente via API
    this.editModal?.hide();
    // fallback: quitamos overlay si queda
    setTimeout(() => this.removeBackdrop(), 50);
  }

  cancelarEdicion() {
    this.usuarioEditar.set(null);
    this.editModal?.hide();
    setTimeout(() => this.removeBackdrop(), 50);
  }

  // ---------- Delete flow ----------
  abrirEliminar(usuario: Usuario) {
    this.usuarioSeleccionado.set({ ...usuario });
    this.cd.detectChanges();

    if (!this.deleteModal) {
      const el = document.getElementById('delete-modal');
      if (el) this.deleteModal = new Modal(el);
    }
    this.deleteModal?.show();
    this.removeBackdrop();
  }

  confirmarEliminar() {
    const usuario = this.usuarioSeleccionado();
    if (usuario) {
      this.usuarios.update(lista => lista.filter(u => u.id !== usuario.id));
      this.usuarioSeleccionado.set(null);
    }
    this.deleteModal?.hide();
    setTimeout(() => this.removeBackdrop(), 50);
  }

  cancelarEliminacion() {
    this.usuarioSeleccionado.set(null);
    this.deleteModal?.hide();
    setTimeout(() => this.removeBackdrop(), 50);
  }
}
