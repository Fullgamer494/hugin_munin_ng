import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../../../../core/services/registration.service';
import { SpecimenService } from '../../../../core/services/specimen.service';
import { CatalogsService } from '../../../../core/services/catalogs.service';
import { DeregistrationRequest } from '../../../../core/models/deregistration.model';
import { SpecimenResponse } from '../../../../core/models/specimen.model';
import { DeregistrationCause } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-deregister-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deregister-form.component.html',
  styleUrls: ['./deregister-form.component.css']
})
export class DeregisterFormComponent implements OnInit {
  deregisterForm!: FormGroup;
  specimens: SpecimenResponse[] = [];
  causes: DeregistrationCause[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private specimenService: SpecimenService,
    private catalogsService: CatalogsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCatalogs();
  }

  private initForm(): void {
    this.deregisterForm = this.fb.group({
      specimenId: ['', [Validators.required]],
      causeId: ['', [Validators.required]],
      registeredBy: [1, [Validators.required]],
      deregistrationDate: ['', [Validators.required]],
      destination: ['', [Validators.maxLength(200)]],
      observations: [''],
      documentFile: ['']
    });
  }

  private loadCatalogs(): void {
    this.specimenService.getAllSpecimens().subscribe({
      next: (data) => this.specimens = data,
      error: (error) => console.error('Error al cargar especímenes:', error)
    });

    this.catalogsService.getDeregistrationCauses().subscribe({
      next: (data) => this.causes = data,
      error: (error) => console.error('Error al cargar causas:', error)
    });
  }

  onSubmit(): void {
    if (this.deregisterForm.invalid) {
      this.markFormGroupTouched(this.deregisterForm);
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData: DeregistrationRequest = this.deregisterForm.value;

    this.registrationService.createDeregistration(formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Baja registrada exitosamente';
        setTimeout(() => this.router.navigate(['/registrations']), 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Error al registrar la baja';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/registrations']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.deregisterForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.deregisterForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}