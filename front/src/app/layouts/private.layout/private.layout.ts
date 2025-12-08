import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header.component/header.component";
import { AsideComponent } from "../../shared/components/aside.component/aside.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-private.layout',
  imports: [RouterOutlet, HeaderComponent, AsideComponent],
  templateUrl: './private.layout.html',
  styleUrl: './private.layout.css',
})
export class PrivateLayout {

}
