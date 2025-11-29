import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/infrastructure/adapters/auth/auth.service';

@Component({
  selector: 'hg-aside',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  private authService = inject(AuthService);
  
  isSubnavOpen = false;

  toggleSubnav(event: Event): void {
    event.stopPropagation();
    this.isSubnavOpen = !this.isSubnavOpen;
  }

  closeSubnav(): void {
    this.isSubnavOpen = false;
  }

  onLogout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }
}