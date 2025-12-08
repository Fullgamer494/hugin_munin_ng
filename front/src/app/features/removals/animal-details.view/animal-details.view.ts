import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { EspecimenService } from '../../../api/application/especimen.service';
import { RegistroBajaDetalleResponse } from '../../../api/domain/models/especimen-baja.model';

@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './animal-details.view.html',
  styleUrl: './animal-details.view.css',
  providers: [DatePipe]
})
export class AnimalDetailsView implements OnInit {

  private route = inject(ActivatedRoute);
  private especimenService = inject(EspecimenService);
  private datePipe = inject(DatePipe);

  especimenId: number | null = null;
  animal: RegistroBajaDetalleResponse | null = null;
  isLoading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.especimenId = +idParam;
        this.loadDetails();
      } else {
        this.isLoading = false;
        this.error = 'No se proporcionó ID de especimen.';
      }
    });
  }

  loadDetails(): void {
    if (this.especimenId) {
      this.especimenService.getRegistroBajaByEspecimenId(this.especimenId).subscribe({
        next: (data) => {
          this.animal = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar detalles de baja:', err);
          this.error = 'No se pudo cargar la información del animal.';
          this.isLoading = false;
        }
      });
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || 'N/A';
  }
}
