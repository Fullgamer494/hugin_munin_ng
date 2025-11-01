import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-descriptiva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './descriptiva.html',
  styleUrl: './descriptiva.css',
})
export class Descriptiva {
  @Input() formGroup!: FormGroup;
  @Input() isExpanded = false;
  @Output() toggle = new EventEmitter<void>();

  onToggle(): void {
    this.toggle.emit();
  }
}