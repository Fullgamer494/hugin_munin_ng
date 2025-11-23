import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'hg-header',
  imports: [RouterLink, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user_name = 'Gilberto Málaga';
  user_role = 'Admin general'
  user_pic = 'https://picsum.photos/200'
}
