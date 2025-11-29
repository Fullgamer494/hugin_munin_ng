import { Component, OnInit, AfterViewInit, QueryList, ViewChildren, ElementRef, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, Router, ActivatedRoute } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms'; 

import { EspecimenService } from '../../../api/application/especimen.service'; 
import { AltaEspecimenRequest, EspecimenDetalleResponse, UpdateAltaEspecimenRequest } from '../../../api/domain/models/especimen-alta.model'; 
import { C } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-register-form-edit.view',
  standalone: true,
  imports: [RouterLink, MatIcon, CommonModule, ReactiveFormsModule], 
  templateUrl: './register-form-edit.view.html',
  styleUrl: './register-form-edit.view.css',
})
export class RegisterFormEditView implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private especimenService = inject(EspecimenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  specimenForm!: FormGroup;
  isSaving: boolean = false; 
  isEditing: boolean = false;
  specimenId: number | null = null;

  @ViewChildren('toggleBtn') toggleButtons!: QueryList<ElementRef>;
  @ViewChildren('sectionBody') sectionBodies!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.initializeForm();
    this.loadIdAndData();
  }
  
  private initializeForm(): void {
    this.specimenForm = this.fb.group({
      // Campos deshabilitados y cargados en edición
      numInventario: [{ value: '', disabled: true }, Validators.required], 
      areaOrigen: [{ value: '', disabled: true }, Validators.required], 
      ubicacionOrigen: [{ value: '', disabled: true }, Validators.required], 
      areaDestino: [{ value: '', disabled: true }, Validators.required], 
      ubicacionDestino: [{ value: '', disabled: true }, Validators.required],

      // Campos editables
      nombreEspecimen: [''],
      fechaIngreso: ['', Validators.required], 
      genero: ['', Validators.required],
      especieNombre: ['', Validators.required],
      origenAltaId: [null, Validators.required], 
      procedencia: ['', Validators.required],
      observacionAlta: [''], 
      responsableId: [1, Validators.required], 
    });
  }

  private loadIdAndData(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.specimenId = +idParam;
        this.isEditing = true;
        this.loadSpecimenData(this.specimenId);
      } else {
        // Modo Alta: Asignar valor por defecto si aplica
        this.specimenForm.get('areaOrigen')?.setValue('Externo'); 
      }
    });
  }
  
  private loadSpecimenData(id: number): void {
    this.especimenService.getSpecimenById(id).subscribe({
      next: (data: EspecimenDetalleResponse) => {
        
        // Creamos un objeto plano que coincida con tus Form Controls
        const formData = {
          // 1. Datos directos del espécimen
          numInventario: data.numInventario,
          nombreEspecimen: data.nombreEspecimen,
          genero: data.genero,
          especieNombre: data.especieNombre,

          // 2. Datos anidados en 'registroAlta'
          fechaIngreso: data.registroAlta.fechaIngreso ? this.formatDate(data.registroAlta.fechaIngreso) : '',
          procedencia: data.registroAlta.procedencia,
          observacionAlta: data.registroAlta.observacion, // Nota: En tu modelo es 'observacion', en el form es 'observacionAlta'
          responsableId: data.registroAlta.responsableId,
          
          origenAltaId: data.origenAltaId,

          // 3. Datos anidados en 'registroAlta.traslado' (Aquí están los deshabilitados)
          areaOrigen: data.registroAlta.traslado?.areaOrigen,
          ubicacionOrigen: data.registroAlta.traslado?.ubicacionOrigen,
          areaDestino: data.registroAlta.traslado?.areaDestino,
          ubicacionDestino: data.registroAlta.traslado?.ubicacionDestino,
        };

        // patchValue actualiza los campos, incluso si están disabled
        this.specimenForm.patchValue(formData);
      },
      error: (err) => console.error('Error al cargar datos:', err)
    });
  }

  private formatDate(dateInput: Date | string): string {
    const date = new Date(dateInput);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onSubmit(): void {
    if (this.specimenForm.invalid) {
      this.specimenForm.markAllAsTouched(); 
      console.error('Formulario inválido.');
      return;
    }

    this.isSaving = true;
    const rawValue = this.specimenForm.getRawValue(); 
    
    // --- Lógica de Mapeo de Request ---
    
    let requestToSend: AltaEspecimenRequest | UpdateAltaEspecimenRequest;

    if (this.isEditing && this.specimenId) {
        
        requestToSend = {
            nombreEspecimen: rawValue.nombreEspecimen,
            genero: rawValue.genero,
            especieNombre: rawValue.especieNombre,
            
            // Campos de origen/procedencia/descripción
            fechaIngreso: new Date(rawValue.fechaIngreso), // Se asume que el backend espera un objeto Date/Timestamp
            origenAltaId: rawValue.origenAltaId,
            procedencia: rawValue.procedencia,
            observacion: rawValue.observacionAlta, // Mapeo: formulario.observacionAlta -> DTO.observacion
            
            // Campos de ubicación
            ubicacionDestino: rawValue.ubicacionDestino,
            // Motivo no está en el formulario, se asume un valor nulo o fijo si es obligatorio.
            motivo: 'Actualización de datos', // Asumiendo un valor por defecto, ya que no está en el Form
        } as UpdateAltaEspecimenRequest;

      
    } else {
        // Mapeo al DTO de ALTA (AltaEspecimenRequest)
        // Este DTO requiere: fechaIngreso como Date y usa observacionAlta.
        requestToSend = {
          ...rawValue,
          fechaIngreso: new Date(rawValue.fechaIngreso) // Convertir a Date
        } as AltaEspecimenRequest;
    }

    const apiCall = this.isEditing && this.specimenId 
      ? this.especimenService.updateSpecimen(this.specimenId, requestToSend as UpdateAltaEspecimenRequest)
      : this.especimenService.saveSpecimen(requestToSend as AltaEspecimenRequest);

    apiCall.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['../']); 
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.isSaving = false;
      }
    });
  }
  
  // Lógica de Interacción Visual (Sin Cambios)
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

      setTimeout(() => targetBody.style.maxHeight = 'none', 400);

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

  onFieldBlur(event: any): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const control = this.specimenForm.get(field.id) as AbstractControl; 

    if (control && control.touched && !control.disabled) { 
        field.style.borderColor = (control.invalid && field.hasAttribute('required')) 
          ? '#dc3545' 
          : '#28a745';
    }
  }

  onFieldInput(event: any): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const control = this.specimenForm.get(field.id) as AbstractControl;

    if (control && !control.disabled) { 
        field.style.borderColor = (control.valid && control.value.trim() !== '') 
          ? '#28a745' 
          : ''; 
    }
  }
}