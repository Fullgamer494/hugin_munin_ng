import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegistrationService } from '../../../../core/services/registration.service';
import { RegistrationResponse } from '../../../../core/models/registration.model';
import { DeregistrationResponse } from '../../../../core/models/deregistration.model';

@Component({
  selector: 'app-registrations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registrations-list.component.html',
  styleUrls: ['./registrations-list.component.css']
})
export class RegistrationsListComponent implements OnInit {
  registrations: RegistrationResponse[] = [];
  deregistrations: DeregistrationResponse[] = [];
  loading = false;
  errorMessage = '';
  activeTab: 'registrations' | 'deregistrations' = 'registrations';

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.activeTab === 'registrations') {
      this.loadRegistrations();
    } else {
      this.loadDeregistrations();
    }
  }

  loadRegistrations(): void {
    this.registrationService.getAllRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al cargar las altas';
        this.loading = false;
      }
    });
  }

  loadDeregistrations(): void {
    this.registrationService.getAllDeregistrations().subscribe({
      next: (data) => {
        this.deregistrations = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al cargar las bajas';
        this.loading = false;
      }
    });
  }

  switchTab(tab: 'registrations' | 'deregistrations'): void {
    this.activeTab = tab;
    this.loadData();
  }

  createRegistration(): void {
    this.router.navigate(['/registrations/register']);
  }

  createDeregistration(): void {
    this.router.navigate(['/registrations/deregister']);
  }

  deleteRegistration(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta alta?')) {
      this.registrationService.deleteRegistration(id).subscribe({
        next: () => {
          this.loadRegistrations();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al eliminar el alta';
        }
      });
    }
  }
}