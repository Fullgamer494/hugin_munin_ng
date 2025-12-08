import { Component, AfterViewInit, OnInit, QueryList, ViewChildren, ElementRef, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { EspecimenService } from '../../../api/application/especimen.service';
import { EspecimenDetalleResponse } from '../../../api/domain/models/especimen-alta.model';
import { RegistroBajaRequest, CausaBajaResponse } from '../../../api/domain/models/especimen-baja.model';

@Component({
  selector: 'app-deregister-form',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule],
  templateUrl: './deregister-form.view.html',
  styleUrl: './deregister-form.view.css',
})
export class DeregisterFormView implements AfterViewInit, OnInit {
  @ViewChildren('toggleBtn') toggleButtons!: QueryList<ElementRef>;
  @ViewChildren('sectionBody') sectionBodies!: QueryList<ElementRef>;

  private especimenService = inject(EspecimenService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  specimenId: number = 0;
  specimenData: EspecimenDetalleResponse | null = null;
  isLoading = true;
  error = '';
  causasBaja: CausaBajaResponse[] = [];

  ngOnInit(): void {
    this.loadCausasBaja();
    this.route.params.subscribe(params => {
      this.specimenId = Number(params['id']);

      if (this.specimenId) {
        this.loadSpecimenData();
      } else {
        this.error = 'ID de animal no proporcionado';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.toggleButtons.length > 0) {
        const firstButton = this.toggleButtons.first.nativeElement;
        const firstBody = this.sectionBodies.first.nativeElement;

        firstButton.setAttribute('aria-expanded', 'true');
        firstBody.classList.add('initial-open');

        const h2 = firstButton.querySelector('h2');
        const icon = firstButton.querySelector('.toggle-icon');
        if (h2) h2.style.color = 'var(--green-font)';
        if (icon) icon.style.color = 'var(--green-font)';
      }
    });
  }

  loadCausasBaja(): void {
    this.especimenService.getAllCausasBaja().subscribe({
      next: (data) => {
        this.causasBaja = data;
      },
      error: (err) => {
        console.error('Error al cargar causas de baja:', err);
      }
    });
  }

  loadSpecimenData(): void {
    console.log('Cargando datos del animal ID:', this.specimenId);

    this.especimenService.getSpecimenById(this.specimenId)
      .subscribe({
        next: (data) => {
          console.log('Datos del animal cargados:', data);
          this.specimenData = data;
          this.isLoading = false;

          setTimeout(() => {
            this.fillFormFields();
          }, 100);
        },
        error: (err) => {
          console.error('Error al cargar datos del animal:', err);
          this.error = 'No se pudo cargar la información del animal';
          this.isLoading = false;

          alert('Error: No se pudo cargar la información del animal');
          this.router.navigate(['/animals']);
        }
      });
  }

  fillFormFields(): void {
    if (!this.specimenData) return;

    const niAnimalInput = document.getElementById('NI_animal') as HTMLInputElement;
    const generoInput = document.getElementById('genero') as HTMLInputElement;
    const especieInput = document.getElementById('especie') as HTMLInputElement;

    if (niAnimalInput) niAnimalInput.value = this.specimenData.numInventario;
    if (generoInput) generoInput.value = this.specimenData.genero || '';
    if (especieInput) {
      especieInput.value = `${this.specimenData.genero} ${this.specimenData.especieNombre}`;
    }

    const fechaBajaInput = document.getElementById('fecha_baja') as HTMLInputElement;
    if (fechaBajaInput) {
      fechaBajaInput.value = new Date().toISOString().split('T')[0];
    }
  }

  toggleSection(event: Event, index: number): void {
    const button = event.currentTarget as HTMLElement;
    const targetBody = this.sectionBodies.toArray()[index].nativeElement;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', (!isExpanded).toString());

    const h2 = button.querySelector('h2') as HTMLElement;
    const icon = button.querySelector('.toggle-icon') as HTMLElement;

    if (!isExpanded) {
      targetBody.classList.remove('initial-open');
      targetBody.style.display = 'flex';
      targetBody.style.maxHeight = '0px';
      targetBody.style.opacity = '0';
      targetBody.style.transform = 'translateY(-10px)';

      targetBody.offsetHeight;

      targetBody.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      targetBody.style.maxHeight = targetBody.scrollHeight + 'px';
      targetBody.style.opacity = '1';
      targetBody.style.transform = 'translateY(0)';

      if (h2) h2.style.color = 'var(--green-font)';
      if (icon) icon.style.color = 'var(--green-font)';

      setTimeout(() => {
        targetBody.style.maxHeight = 'none';
      }, 400);

    } else {
      targetBody.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      targetBody.style.maxHeight = targetBody.scrollHeight + 'px';

      targetBody.offsetHeight;

      targetBody.style.maxHeight = '0px';
      targetBody.style.opacity = '0';
      targetBody.style.transform = 'translateY(-10px)';

      if (h2) h2.style.color = 'var(--stroke)';
      if (icon) icon.style.color = 'var(--stroke)';

      setTimeout(() => {
        targetBody.style.display = 'none';
        targetBody.style.transition = '';
      }, 400);
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.specimenData) {
      alert('Error: No se han cargado los datos del animal');
      return;
    }

    const form = event.target as HTMLFormElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    const formData = new FormData(form);

    const fechaBaja = formData.get('fecha_baja') as string;
    if (!fechaBaja) {
      alert('Por favor selecciona la fecha de baja');
      return;
    }

    const causaBajaId = parseInt(formData.get('causa_baja') as string);
    const observaciones = formData.get('observaciones_baja') as string;

    // Find causa name for confirmation
    const causaNombre = this.causasBaja.find(c => c.id === causaBajaId)?.nombreCausaBaja || 'Desconocida';

    const confirmed = confirm(
      `¿Confirmas dar de baja el siguiente animal?\n\n` +
      `Identificador: ${this.specimenData.numInventario}\n` +
      `Nombre: ${this.specimenData.nombreEspecimen || 'Sin nombre'}\n` +
      `Especie: ${this.specimenData.genero} ${this.specimenData.especieNombre}\n\n` +
      `Causa: ${causaNombre}\n` +
      `Fecha: ${fechaBaja}\n\n` +
      'Esta acción marcará al animal como inactivo y creará un registro de baja.'
    );

    if (!confirmed) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    const deregistrationData: RegistroBajaRequest = {
      especimenId: this.specimenId,
      causaBajaId: causaBajaId,
      responsableId: 1, // Hardcoded for now as in original
      fechaBaja: fechaBaja,
      observacion: observaciones || undefined
    };

    console.log('Enviando registro de baja:', deregistrationData);

    this.especimenService.createRegistroBaja(deregistrationData).subscribe({
      next: (response) => {
        console.log('Registro de baja creado con ID:', response.id);

        alert(
          `Animal dado de baja exitosamente\n\n` +
          `Identificador: ${this.specimenData!.numInventario}\n` +
          `Causa: ${causaNombre}\n` +
          `Registro de baja ID: ${response.id}`
        );

        this.router.navigate(['/animals']);
      },
      error: (err) => {
        console.error('Error al crear registro de baja:', err);

        let errorMessage = 'No se pudo dar de baja el animal';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        alert(`Error: ${errorMessage}`);

        submitBtn.disabled = false;
        submitBtn.textContent = 'Dar de baja';
      }
    });
  }

  onFieldBlur(event: Event): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    if (field.hasAttribute('required')) {
      if (field.value.trim() === '') {
        field.style.borderColor = '#dc3545';
      } else {
        field.style.borderColor = '#28a745';
      }
    }
  }

  onFieldInput(event: Event): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    if (field.hasAttribute('required') && field.value.trim() !== '') {
      field.style.borderColor = '#28a745';
    }
  }
}