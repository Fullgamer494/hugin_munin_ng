import { Component, AfterViewInit, OnInit, QueryList, ViewChildren, ElementRef, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
// Módulos Reactivos
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms'; 

// Importa tu servicio y modelo de Dominio (rutas asumidas)
import { EspecimenService } from '../../../api/application/especimen.service'; 
import { AltaEspecimenRequest } from '../../../api/domain/models/especimen-alta.model'; 


@Component({
  selector: 'app-register-form.view',
  standalone: true,
  // Importaciones necesarias: RouterLink, MatIcon, CommonModule, ReactiveFormsModule
  imports: [RouterLink, MatIcon, CommonModule, ReactiveFormsModule], 
  templateUrl: './register-form.view.html',
  styleUrl: './register-form.view.css',
})
export class RegisterFormView implements OnInit, AfterViewInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private especimenService = inject(EspecimenService);
  private router = inject(Router);

  // Propiedades de estado y formulario
  specimenForm!: FormGroup;
  isSaving: boolean = false; 

  // Referencias a elementos del DOM (Para la funcionalidad de despliegue)
  @ViewChildren('toggleBtn') toggleButtons!: QueryList<ElementRef>;
  @ViewChildren('sectionBody') sectionBodies!: QueryList<ElementRef>;

  ngOnInit(): void {
    // Inicialización del FormGroup con todos los campos del DTO
    this.specimenForm = this.fb.group({
      // Identificación
      numInventario: ['', Validators.required],
      nombreEspecimen: [''],
      // Formato: ['valor inicial', [validadores]]
      fechaIngreso: ['', Validators.required], 

      // Clasificación Taxonómica
      genero: ['', Validators.required],
      especieNombre: ['', Validators.required],
      
      // Información de Procedencia
      origenAltaId: [null, Validators.required], 
      procedencia: ['', Validators.required],
      observacionAlta: [''], // El campo de observaciones
      
      // Ubicación Actual
      // areaOrigen: Deshabilitado y con valor por defecto "Externo"
      areaOrigen: [{ value: 'Externo', disabled: true }, Validators.required], 
      areaDestino: ['', Validators.required],
      ubicacionOrigen: ['', Validators.required],
      ubicacionDestino: ['', Validators.required],

      // Responsable (Asignar ID del usuario logueado, aquí asumimos '1')
      responsableId: [1, Validators.required], 
    });
  }

  // --- Lógica del Formulario y Conexión al Backend ---

// En register-form.view.ts

onSubmit(): void {
  if (this.specimenForm.invalid) {
    this.specimenForm.markAllAsTouched();
    // Opcional: mostrar un mensaje visual de error tipo Toast/Snackbar aquí
    return;
  }

  this.isSaving = true;
  const rawValue = this.specimenForm.getRawValue();

  // Mapeo explícito para asegurar tipos de datos correctos hacia el Backend
  const altaRequest: AltaEspecimenRequest = {
      genero: rawValue.genero,
      especieNombre: rawValue.especieNombre,
      numInventario: rawValue.numInventario,
      nombreEspecimen: rawValue.nombreEspecimen,
      
      // IMPORTANTE: Responsable hardcodeado a 1 por ahora (Gilberto en tus seeds)
      // Idealmente esto vendría de tu AuthService.getCurrentUserId()
      responsableId: 1, 

      // Conversión de fecha string a objeto Date para que el Adapter lo procese
      fechaIngreso: new Date(rawValue.fechaIngreso),

      // IMPORTANTE: Conversión a Número. El HTML devuelve string "1", el Backend espera Int 1.
      origenAltaId: Number(rawValue.origenAltaId),
      
      procedencia: rawValue.procedencia,
      observacionAlta: rawValue.observacionAlta,

      // Datos de ubicación
      areaDestino: rawValue.areaDestino,
      ubicacionOrigen: rawValue.ubicacionOrigen,
      ubicacionDestino: rawValue.ubicacionDestino
      
      // Nota: No enviamos 'areaOrigen' porque tu Backend (EspecimenRoutes.kt) 
      // lo define automáticamente como "Externo".
  };

  this.especimenService.saveSpecimen(altaRequest).subscribe({
    next: (response) => {
      console.log('✅ Especimen registrado con éxito:', response);
      this.isSaving = false;
      this.router.navigate(['/app/animals']); // Redirige a la tabla
    },
    error: (err) => {
      console.error('❌ Error al guardar:', err);
      this.isSaving = false;
      alert('Error al registrar el animal. Revisa la consola para más detalles.');
    }
  });
}  
  // --- Lógica de Interacción Visual Recuperada ---
  
  // Lógica de apertura de la primera sección al cargar la vista
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

  // Función para desplegar/contraer secciones con transición CSS
  toggleSection(event: Event, index: number): void {
    const button = event.currentTarget as HTMLElement;
    const targetBody = this.sectionBodies.toArray()[index].nativeElement;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', (!isExpanded).toString());

    const h2 = button.querySelector('h2') as HTMLElement;
    const icon = button.querySelector('.toggle-icon') as HTMLElement;

    if (!isExpanded) {
      // Abrir la sección
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
      // Cerrar la sección
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

  // Lógica manual de color de borde para simular validación (se puede mejorar con Angular)
  onFieldBlur(event: any): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const control = this.specimenForm.get(field.id) as AbstractControl; // Obtener el FormControl

    if (control && control.touched) {
        if (control.invalid && field.hasAttribute('required')) {
            field.style.borderColor = '#dc3545'; // Rojo si es inválido y requerido
        } else {
            field.style.borderColor = '#28a745'; // Verde si es válido o no requerido
        }
    }
  }

  onFieldInput(event: any): void {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const control = this.specimenForm.get(field.id) as AbstractControl;

    if (control && control.valid && control.value.trim() !== '') {
        field.style.borderColor = '#28a745'; // Verde al escribir si es válido
    } else {
        field.style.borderColor = ''; // Limpiar si es vacío o inválido
    }
  }
}