import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-procedencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './procedencia.html',
  styleUrl: './procedencia.css',
})
export class Procedencia {
  @Input() formGroup!: FormGroup;
  @Input() isExpanded = false;
  @Output() toggle = new EventEmitter<void>();

  originOptions = [
    { id: 1, name: 'Donación' },
    { id: 2, name: 'Rescate' },
    { id: 3, name: 'Incautado' },
    { id: 4, name: 'Abandono' },
    { id: 5, name: 'Captura' },
    { id: 6, name: 'Depositaria' },
    { id: 7, name: 'Intercambio' }
  ];

  onToggle(): void {
    this.toggle.emit();
  }
}