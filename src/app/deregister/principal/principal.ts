import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IdentificacionBaja } from '../secciones/ident/ident';
import { DatosBaja } from '../secciones/datos-baja/datos-baja';
import { InformacionDescriptivaBaja } from '../secciones/descrip/descrip';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IdentificacionBaja,
    DatosBaja,
    InformacionDescriptivaBaja
  ],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal implements OnInit {
  deregisterForm!: FormGroup;

  sections = {
    identificacion: true,
    datosBaja: false,
    informacionDescriptiva: false
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.deregisterForm = this.fb.group({
      NI_animal: [{ value: '', disabled: true }],
      genero: [{ value: '', disabled: true }],
      especie: [{ value: '', disabled: true }],
      fecha_baja: [''],
      causa_baja: ['1'],
      observaciones_baja: ['']
    });

    this.loadAnimalData();
  }

  loadAnimalData(): void {

    this.deregisterForm.patchValue({
      NI_animal: '12345',
      genero: 'Panthera',
      especie: 'Tigris'
    });
  }

  toggleSection(section: keyof typeof this.sections): void {
    this.sections[section] = !this.sections[section];
  }

  onSubmit(): void {
    const formValue = {
      ...this.deregisterForm.value,
      NI_animal: this.deregisterForm.get('NI_animal')?.value,
      genero: this.deregisterForm.get('genero')?.value,
      especie: this.deregisterForm.get('especie')?.value
    };
    
    console.log('Dar de baja ejemplar:', formValue);

  }

  onCancel(): void {
    window.history.back();
  }
}