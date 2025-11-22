export interface Specimen {
  id_especimen: number;
  num_inventario: string;
  nombre_especimen: string | null;
  activo: boolean;
  especie?: {
    genero: string;
    especie: string;
  };
}

export interface ReportType {
  id_tipo_reporte: number;
  nombre_tipo_reporte: string;
}

export interface Responsible {
  id_usuario: number;
  nombre_usuario: string;
}

export interface Report {
  id_reporte: number;
  id_tipo_reporte: number;
  id_especimen: number;
  id_responsable: number;
  asunto: string;
  contenido: string;
  fecha_reporte: string | number;
  tipo_reporte?: ReportType;
  especimen?: Specimen;
  responsable?: Responsible;
}

export class ReportEntity implements Report {
  constructor(
    public readonly id_reporte: number,
    public readonly id_tipo_reporte: number,
    public readonly id_especimen: number,
    public readonly id_responsable: number,
    public readonly asunto: string,
    public readonly contenido: string,
    public readonly fecha_reporte: string | number,
    public readonly tipo_reporte?: ReportType,
    public readonly especimen?: Specimen,
    public readonly responsable?: Responsible
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.asunto || this.asunto.trim() === '') {
      throw new Error('El asunto del reporte es requerido');
    }
    if (!this.contenido || this.contenido.trim() === '') {
      throw new Error('El contenido del reporte es requerido');
    }
  }

  getFormattedDate(): string {
    try {
      const date = typeof this.fecha_reporte === 'number' 
        ? new Date(this.fecha_reporte)
        : new Date(this.fecha_reporte);
      
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'Error en fecha';
    }
  }

  getTipoReporteName(): string {
    return this.tipo_reporte?.nombre_tipo_reporte || 'N/A';
  }

  getResponsableName(): string {
    return this.responsable?.nombre_usuario || 'N/A';
  }

  getSpecimenIdentifier(): string {
    return this.especimen?.num_inventario || 'N/A';
  }

  getSpecimenName(): string {
    return this.especimen?.nombre_especimen || 'Sin nombre';
  }

  getSpecimenScientificName(): string {
    if (!this.especimen?.especie) return 'No disponible';
    return `${this.especimen.especie.genero} ${this.especimen.especie.especie}`;
  }

  isActive(): boolean {
    return this.especimen?.activo || false;
  }

  
}