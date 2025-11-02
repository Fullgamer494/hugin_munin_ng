import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-informacion-descriptiva-baja',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './descrip.html',
  styleUrl: './descrip.css'
})
export class InformacionDescriptivaBaja {
  @Input() formGroup!: FormGroup;
  @Input() isExpanded = false;
  @Output() toggle = new EventEmitter<void>();

  onToggle(): void {
    this.toggle.emit();
  }
}