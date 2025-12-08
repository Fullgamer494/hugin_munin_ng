import { Component, AfterViewInit, OnInit, QueryList, ViewChildren, ElementRef, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { EspecimenService } from '../../../api/application/especimen.service';
import { RegistroBajaDetalleResponse, RegistroBajaUpdateRequest, CausaBajaResponse } from '../../../api/domain/models/especimen-baja.model';

@Component({
  selector: 'app-deregister-form-edit',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule],
  templateUrl: './deregister-form-edit.view.html',
  styleUrl: './deregister-form-edit.view.css',
})
export class DeregisterFormEditView implements AfterViewInit, OnInit {
  @ViewChildren('toggleBtn') toggleButtons!: QueryList<ElementRef>;
  @ViewChildren('sectionBody') sectionBodies!: QueryList<ElementRef>;

  private especimenService = inject(EspecimenService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  registroId: number = 0;
  registroBaja: RegistroBajaDetalleResponse | null = null;
  causasBaja: CausaBajaResponse[] = [];
  isLoading = true;
  error = '';

  ngOnInit(): void {
    this.loadCausasBaja();
    this.route.params.subscribe(params => {
      this.registroId = Number(params['id']);

      if (this.registroId) {
        this.loadRegistroData();
      } else {
        this.error = 'ID de registro no proporcionado';
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

  loadRegistroData(): void {
    this.especimenService.getRegistroBajaByEspecimenId(this.registroId).subscribe({
      next: (data) => {
        this.registroBaja = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información de la baja';
        this.isLoading = false;
      }
    });
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

    if (!this.registroBaja) return;

    const form = event.target as HTMLFormElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    const formData = new FormData(form);

    const fechaBaja = formData.get('fecha_baja') as string;
    const causaBajaId = parseInt(formData.get('causa_baja') as string);
    const observaciones = formData.get('observaciones_baja') as string;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    const updateRequest: RegistroBajaUpdateRequest = {
      causaBajaId: causaBajaId,
      fechaBaja: fechaBaja,
      observacion: observaciones || undefined
    };

    // We update using the ID of the RegistroBaja, which is in this.registroBaja.id
    this.especimenService.updateRegistroBaja(this.registroBaja.id, updateRequest).subscribe({
      next: (response) => {
        alert('Registro de baja actualizado exitosamente');
        this.router.navigate(['/animals']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar el registro');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar cambios';
      }
    });
  }

  onFieldBlur(event: Event): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (field.hasAttribute('required')) {
      field.style.borderColor = field.value.trim() === '' ? '#dc3545' : '#28a745';
    }
  }

  onFieldInput(event: Event): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (field.hasAttribute('required') && field.value.trim() !== '') {
      field.style.borderColor = '#28a745';
    }
  }
}
