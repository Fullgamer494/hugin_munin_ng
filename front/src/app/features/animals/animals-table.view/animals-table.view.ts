import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-animals-table.view',
  imports: [MatIcon, RouterLink],
  templateUrl: './animals-table.view.html',
  styleUrl: './animals-table.view.css',
})
export class AnimalsTableView {

}
