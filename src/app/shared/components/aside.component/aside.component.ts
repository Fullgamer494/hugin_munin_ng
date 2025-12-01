import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../api/application/login.service';

@Component({
  selector: 'hg-aside',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  
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
      this.loginService.logout();
      this.router.navigate(['/login']);
    }
  }
}