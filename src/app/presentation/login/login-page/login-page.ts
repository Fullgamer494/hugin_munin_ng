import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header';
import { LoginFormComponent } from '../login-form/login-form';

@Component({
  selector: 'app-login-page',
  standalone: true,
  // 1. Importar los componentes que usa el template
  imports: [
    CommonModule,
    HeaderComponent,
    LoginFormComponent
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPageComponent {
  // No se necesita lógica aquí, la página solo actúa como contenedor
}