import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  message: string = '';

  login(){
    if(this.username === 'admin' && this.password === '123456'){
      this.message = '✅Inicio de sesión exitoso. ¡Bienvenido!';
    }else{
      this.message = '❌Error de inicio de sesión. Credenciales incorrectas.';
    }
  }

  register(){
    this.message = '🔔Funcionalidad de registro no implementada aún.';
  }

}
