import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-datos-baja',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datos-baja.html',
  styleUrl: './datos-baja.css'
})
export class DatosBaja {
  @Input() formGroup!: FormGroup;
  @Input() isExpanded = false;
  @Output() toggle = new EventEmitter<void>();

  causasBaja = [
    { id: '1', name: 'Aprovechamiento' },
    { id: '2', name: 'Cambio de depositaría' },
    { id: '3', name: 'Fuga' },
    { id: '4', name: 'Deceso' },
    { id: '5', name: 'Préstamo' },
    { id: '6', name: 'Liberación' },
    { id: '7', name: 'Entrega a PROFEPA' }
  ];

  onToggle(): void {
    this.toggle.emit();
  }
}