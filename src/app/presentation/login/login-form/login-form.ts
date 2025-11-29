import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/infrastructure/adapters/auth/auth.service';
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
  private authService = inject(AuthService);
  private router = inject(Router);

  passwordFieldType: string = 'password';
  errorMessage: string = '';
  
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required]]
  });

  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Adaptamos el objeto para enviarlo al servicio como 'email'
      const loginData = {
        email: this.loginForm.value.username, // Mapeamos username 
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: () => {
          this.router.navigate(['/app/dashboard']);        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Correo o contraseña incorrectos.';
        }
      });
    } else {
        this.loginForm.markAllAsTouched();
    }
  }
}