import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header';
import { FooterComponent } from '../../../shared/footer/footer';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ 
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPageComponent { }