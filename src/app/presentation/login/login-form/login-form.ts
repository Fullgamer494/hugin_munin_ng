// src/app/presentation/login/login-form/login-form.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../api/application/login.service'; // ✅ De la carpeta API
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
  
  // ✅ Los campos deben coincidir con LoginRequest en auth.model.ts
  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]], 
    contrasena: ['', [Validators.required]]
  });

  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        correo: this.loginForm.value.correo,
        contrasena: this.loginForm.value.contrasena
      };

      console.log('🚀 Enviando login:', loginData);

      this.loginService.login(loginData).subscribe({
        next: (response) => {
          console.log('✅ Login exitoso:', response);
          // El token ya se guardó en AuthAdapter
          this.router.navigate(['/app/dashboard']);
        },
        error: (err) => {
          console.error('❌ Error en login:', err);
          this.errorMessage = 'Correo o contraseña incorrectos.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}