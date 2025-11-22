import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../../../../core/services/registration.service';
import { SpecimenService } from '../../../../core/services/specimen.service';
import { CatalogsService } from '../../../../core/services/catalogs.service';
import { RegistrationRequest } from '../../../../core/models/registration.model';
import { SpecimenResponse } from '../../../../core/models/specimen.model';
import { RegistrationOrigin } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  specimens: SpecimenResponse[] = [];
  origins: RegistrationOrigin[] = [];
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
    this.registerForm = this.fb.group({
      specimenId: ['', [Validators.required]],
      originId: ['', [Validators.required]],
      registeredBy: [1, [Validators.required]],
      registrationDate: ['', [Validators.required]],
      guideNumber: [''],
      origin: ['', [Validators.maxLength(200)]],
      arrivalCondition: [''],
      observations: [''],
      documentFile: ['']
    });
  }

  private loadCatalogs(): void {
    this.specimenService.getAllSpecimens().subscribe({
      next: (data) => this.specimens = data,
      error: (error) => console.error('Error al cargar especímenes:', error)
    });

    this.catalogsService.getRegistrationOrigins().subscribe({
      next: (data) => this.origins = data,
      error: (error) => console.error('Error al cargar orígenes:', error)
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData: RegistrationRequest = this.registerForm.value;

    this.registrationService.createRegistration(formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Alta registrada exitosamente';
        setTimeout(() => this.router.navigate(['/registrations']), 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Error al registrar el alta';
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
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}