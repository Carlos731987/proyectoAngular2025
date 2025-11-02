import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-somos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './somos.component.html',
  styleUrls: ['./somos.component.css']
})
export class SomosComponent {
  titulo = 'Quiénes Somos';
  descripcion = 'Somos Importaciones Brisa & Denis - tu tienda de confianza';
}