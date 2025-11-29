import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../landing/header/header';
import { LoginFormComponent } from '../login-form/login-form'; 

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LoginFormComponent 
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPageComponent { }