import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'hg-aside',
  imports: [RouterLink, MatIcon],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  isSubnavOpen = false;

  toggleSubnav(event: Event): void {
    event.stopPropagation();
    this.isSubnavOpen = !this.isSubnavOpen;
  }

  closeSubnav(): void {
    this.isSubnavOpen = false;
  }
}
