import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent { }