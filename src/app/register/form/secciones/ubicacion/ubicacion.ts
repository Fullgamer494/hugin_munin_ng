import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ubicacion.html',
  styleUrl: './ubicacion.css',
})
export class Ubicacion {
  @Input() formGroup!: FormGroup;
  @Input() isExpanded = false;
  @Output() toggle = new EventEmitter<void>();

  areaOrigenOptions = ['Externo'];
  areaDestinoOptions = ['Cuarentena', 'Exhibición', 'Guardería'];

  onToggle(): void {
    this.toggle.emit();
  }
}