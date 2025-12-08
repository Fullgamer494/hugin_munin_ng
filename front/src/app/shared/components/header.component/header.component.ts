import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../api/application/auth.service';
import { UserInfoResponse } from '../../../api/domain/models/user.model';

@Component({
  selector: 'hg-header',
  imports: [RouterLink, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  nombreUsuario!: string
  rol!: string
  urlPic: string = 'https://picsum.photos/200'

  constructor(private auth: AuthService) {}

  ngOnInit(): void{
    this.auth.getCurrentUser().subscribe(data=> {
      this.nombreUsuario = data.nombreUsuario
      this.rol = data.rol
    }
    )
  }

}
