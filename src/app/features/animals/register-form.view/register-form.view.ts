import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { CreateRegistroAltaUseCase } from '../../../features/animals/register-form.view/register.case';
import { CreateEspecieUseCase } from '../../../features/animals/register-form.view/register.case';
import { RegistroAltaRequest, EspecieRequest } from '../../../features/animals/register-form.view/register.model';


@Component({
  selector: 'app-register-form.view',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule],
  templateUrl: './register-form.view.html',
  styleUrl: './register-form.view.css',
})
export class RegisterFormView implements AfterViewInit {
  @ViewChildren('toggleBtn') toggleButtons!: QueryList<ElementRef>;
  @ViewChildren('sectionBody') sectionBodies!: QueryList<ElementRef>;

  private createRegistroAltaUseCase = inject(CreateRegistroAltaUseCase);
  private createEspecieUseCase = inject(CreateEspecieUseCase);
  private router = inject(Router);

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
    
    const form = event.target as HTMLFormElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    const formData = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // 1. Primero crear la especie
    const especieData: EspecieRequest = {
      genero: formData.get('genero') as string,
      especie: formData.get('especie') as string,
      nombreComun: null
    };

    this.createEspecieUseCase.execute(especieData).subscribe({
      next: (especieResponse) => {
        console.log('Especie creada con ID:', especieResponse.id);

        const registroData: RegistroAltaRequest = {
          numInventario: formData.get('NI_animal') as string,
          idEspecie: especieResponse.id,
          nombreEspecimen: formData.get('nombre_especimen') as string,
          
          
          idOrigenAlta: parseInt(formData.get('id_origen') as string),
          idResponsable: 1, 
          fechaIngreso: formData.get('fecha_ingreso') as string,
          procedencia: formData.get('procedencia') as string,
          observacion: formData.get('observaciones_ingreso') as string
        };

        this.createRegistroAltaUseCase.execute(registroData).subscribe({
          next: (response) => {
            console.log('Registro de alta creado:', response);
            
          
            alert('¡Registro creado exitosamente!');
            
           
            form.reset();
            
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Agregar';
          },
          error: (error) => {
            console.error('Error al crear registro de alta:', error);
            alert(`Error: ${error.error?.error || 'No se pudo crear el registro'}`);
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Agregar';
          }
        });
      },
      error: (error) => {
        console.error('Error al crear especie:', error);
        
        
        alert(`Error: ${error.error?.error || 'No se pudo crear la especie'}`);
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Agregar';
      }
    });
  }

  onFieldBlur(event: any): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    if (field.hasAttribute('required')) {
      if (field.value.trim() === '') {
        field.style.borderColor = '#dc3545';
      } else {
        field.style.borderColor = '#28a745';
      }
    }
  }

  onFieldInput(event: any): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    if (field.hasAttribute('required') && field.value.trim() !== '') {
      field.style.borderColor = '#28a745';
    }
  }
}