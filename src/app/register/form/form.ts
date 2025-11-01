import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Identificacion } from './secciones/identificacion/identificacion';
import { Clasificacion } from './secciones/clasificacion/clasificacion';
import { Procedencia } from './secciones/procedencia/procedencia';
import { Ubicacion } from './secciones/ubicacion/ubicacion';
import { Descriptiva } from './secciones/descriptiva/descriptiva';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    Identificacion,
    Clasificacion,
    Procedencia,
    Ubicacion,
    Descriptiva
  ],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {
  Formanimals!: FormGroup;

  sections = {
    identificacion: true,
    clasificacion: false,
    procedencia: false,
    ubicacion: false,
    descriptiva: false
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.Formanimals = this.fb.group({
      NI_animal: [''],
      nombre_especimen: [''],
      fecha_ingreso: [''],
      genero: [''],
      especie: [''],
      id_origen: [1],
      procedencia: [''],
      area_origen: ['Externo'],
      area_destino: [''],
      ubicacion_origen: [''],
      ubicacion_destino: [''],
      observaciones_ingreso: ['']
    });
  }

  toggleSection(section: keyof typeof this.sections): void {
    this.sections[section] = !this.sections[section];
  }

  onSubmit(): void {
    console.log('Form', this.Formanimals.value);
  }

  onCancel(): void {
    this.Formanimals.reset();
  }
}