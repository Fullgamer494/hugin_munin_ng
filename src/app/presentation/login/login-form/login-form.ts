import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../api/application/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css']
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);

  passwordFieldType: string = 'password';
  errorMessage: string = '';
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required]]
  });

  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        correo: this.loginForm.value.email,
        contrasena: this.loginForm.value.password
      };

      this.loginService.login(loginData).subscribe({
        next: () => {
          this.router.navigate(['/app/dashboard']);
        },
        error: (err) => {
          console.error('Error en login:', err);
          
          if (err.status === 401) {
            this.errorMessage = 'Credenciales incorrectas.';
          } else if (err.status === 0) {
            this.errorMessage = 'No se puede conectar con el servidor.';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}