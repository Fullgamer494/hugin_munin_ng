import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent { }