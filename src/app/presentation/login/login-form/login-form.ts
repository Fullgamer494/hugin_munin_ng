import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importar ReactiveFormsModule y todo lo necesario para formularios
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  // 2. Añadir ReactiveFormsModule a los imports
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginFormComponent {
  // Variable para controlar el tipo de input (password o text)
  passwordFieldType = 'password';

  // 3. Definir el formulario reactivo
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  // 4. Función que se llama al enviar el formulario
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario enviado:', this.loginForm.value);
      // Aquí es donde se llamaria al servicio de autenticación
    }
  }

  // 5. Lógica para el botón de mostrar/ocultar contraseña
  togglePasswordVisibility(event: Event) {
    event.preventDefault(); // Prevenir que el clic envíe el formulario
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    
    const icon = event.target as HTMLElement;
    icon.classList.toggle('ti-eye');
    icon.classList.toggle('ti-eye-off');
  }
}