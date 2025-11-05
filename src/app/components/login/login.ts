import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { Register } from '../register/register';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, CommonModule, FormsModule, Register],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor() {
    afterNextRender(() => initFlowbite());
  }

  login(){
    if(this.username === 'admin' && this.password === '123456'){
      this.message = '✅Inicio de sesión exitoso. ¡Bienvenido!';
    }else{
      this.message = '❌Error de inicio de sesión. Credenciales incorrectas.';
    }
  }

  // register(){
  //   this.message = '🔔Funcionalidad de registro no implementada aún.';
  // }

}
