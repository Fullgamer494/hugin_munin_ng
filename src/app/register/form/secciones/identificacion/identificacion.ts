import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-identificacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './identificacion.html',
  styleUrl: './identificacion.css',
})
export class Identificacion {
  @Input() formGroup!: FormGroup;
  @Input() isExpanded = true;
  @Output() toggle = new EventEmitter<void>();

  onToggle(): void {
    this.toggle.emit();
  }
}