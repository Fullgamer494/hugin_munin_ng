import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './menu/sidebar/sidebar';
import { NavbarComponent } from './menu/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="app-layout">
      <app-navbar></app-navbar>
      <app-sidebar></app-sidebar>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'HuginandMunin';
}