import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  reportsOpen = false;
  selectedMenu: string = 'inicio';

  toggleReports(): void {
    this.reportsOpen = !this.reportsOpen;
  }

  selectMenu(menu: string): void {
    this.selectedMenu = menu;
  
    if (menu.startsWith('reporte-')) {
      this.reportsOpen = true;
    }
  }

  isActive(menu: string): boolean {
    return this.selectedMenu === menu;
  }

  logout(): void {
    console.log('Sesión cerrada');
  }
}