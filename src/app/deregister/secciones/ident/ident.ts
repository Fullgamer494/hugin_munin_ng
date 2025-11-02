import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-identificacion-baja',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ident.html',
  styleUrl: './ident.css'
})
export class IdentificacionBaja {
  @Input() formGroup!: FormGroup;
  @Input() isExpanded = true;
  @Output() toggle = new EventEmitter<void>();

  onToggle(): void {
    this.toggle.emit();
  }
}