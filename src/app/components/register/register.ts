import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name: string = '';
  email: string = '';
  rol: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' },
    { value: 'moderator', label: 'Moderador' }
  ]

  register() {
    if (this.name && this.email && this.password && this.rol) {
      this.message = `✅ Registro simulado exitoso como "${this.getRoleLabel()}".`;
    } else {
      this.message = '⚠️ Por favor completa todos los campos.';
    }
  }

  getRoleLabel(): string {
    const r = this.roles.find(r => r.value === this.rol);
    return r ? r.label : '';
  }

}
