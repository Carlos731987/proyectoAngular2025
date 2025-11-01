import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Oferta {
  id: number;
  titulo: string;
  descripcion: string;
  descuento: string;
  color: string;
  imagenUrl: string; // Placeholder
}

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']    
})
export class PromocionesComponent {
  // Datos de promociones de prueba
  ofertas: Oferta[] = [
    {
      id: 1,
      titulo: 'Tecnología Portátil',
      descripcion: '20% de descuento en todos los relojes inteligentes y auriculares inalámbricos.',
      descuento: '20% OFF',
      color: 'red',
      imagenUrl: 'https://placehold.co/400x300/f87171/ffffff?text=Tech',
    },
    {
      id: 2,
      titulo: 'Especial Hogar',
      descripcion: '15% de descuento adicional en todas las máquinas de café y accesorios de cocina.',
      descuento: '15% OFF',
      color: 'green',
      imagenUrl: 'https://placehold.co/400x300/34d399/ffffff?text=Hogar',
    },
    {
      id: 3,
      titulo: 'Liquidación de Temporada',
      descripcion: 'Hasta 40% de descuento en bolsos de cuero y mochilas tácticas seleccionadas.',
      descuento: '40% OFF',
      color: 'blue',
      imagenUrl: 'https://placehold.co/400x300/60a5fa/ffffff?text=Liquidacion',
    },
  ];
}
