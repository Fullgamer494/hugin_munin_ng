import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EspecimenDetalleResponse, RegistroAltaInfo, TrasladoInfo } from '../../../api/domain/models/especimen-alta.model';
import { EspecimenService } from '../../../api/application/especimen.service';
import { EspecimenDetailsView } from '../../../api/domain/models/especimen-alta.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIcon
  ],
  templateUrl: './animal-details.view.html',
  styleUrls: ['./animal-details.view.css'],
  providers: [DatePipe]
})
export class AnimalDetailsView implements OnInit {

  especimenId: number | null = null;
  especimen: EspecimenDetailsView | undefined;
  isLoading: boolean = true;
  error: any = null;

  constructor(
    private route: ActivatedRoute,
    private especimenService: EspecimenService, // Asume la inyección del servicio
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.especimenId = +idParam;
        this.loadEspecimenDetails();
      } else {
        this.isLoading = false;
        this.error = 'No se proporcionó ID de especimen.';
      }
    });
  }

  loadEspecimenDetails(): void {
    if (this.especimenId !== null) {
      this.especimenService.getSpecimenById(this.especimenId).subscribe({
        next: (data: EspecimenDetalleResponse) => {
          this.especimen = this.mapToViewModel(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar los detalles del especimen', err);
          this.error = 'No se pudieron cargar los detalles del especimen.';
          this.isLoading = false;
        }
      });
    }
  }

  mapToViewModel(response: EspecimenDetalleResponse): EspecimenDetailsView {
    const registro: RegistroAltaInfo = response.registroAlta;
    const traslado: TrasladoInfo = registro.traslado;

    return {
      id: response.id,
      numInventario: response.numInventario || 'N/A',
      nombreEspecimen: response.nombreEspecimen || 'N/A',
      genero: response.genero || 'N/A',
      especieNombre: response.especieNombre || 'N/A',
      activo: response.activo,
      
      nombreComun: response.nombreEspecimen || 'N/A', // Usando nombreEspecimen como nombre común
      
      fechaIngreso: registro.fechaIngreso, // Ya es un string de fecha
      estadoActual: response.activo ? 'Activo' : 'Inactivo',

      origen: registro.origenAltaNombre || 'N/A',
      procedencia: registro.procedencia || 'N/A',
      observacionesIngreso: registro.observacion || 'Sin observaciones',
      
      area: traslado.areaDestino || 'N/A',
      ubicacion: traslado.ubicacionDestino || 'N/A'
    };
  }

  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'N/A';
    // Se asume el formato 'yyyy-MM-dd' para la respuesta
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || 'N/A';
  }
}