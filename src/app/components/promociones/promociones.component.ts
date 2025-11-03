import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Promocion {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen: string;
  descripcion: string;
  precioTotal: string;
  precioUnitario: string;
  mensajeWhatsapp: string;
}

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent {
  readonly whatsappBaseUrl = 'https://wa.me/message/3C2ADYSPHC7CE1?text=';
  
  promociones: Promocion[] = [
    {
      id: 1,
      titulo: 'Caja por mayor',
      subtitulo: '3 unidades',
      imagen: 'assets/images/3unidmay.jpeg',
      descripcion: 'Máxima rentabilidad por unidad. Ideal para el que ya quiere arrancar fuerte y tiene un punto de venta.',
      precioTotal: '$183.000',
      precioUnitario: '$61.000 c/u',
      mensajeWhatsapp: 'Hola, quiero comprar una caja por mayor'
    },
    {
      id: 2,
      titulo: 'Caja surtida',
      subtitulo: '6 unidades',
      imagen: 'assets/images/6unidmay.jpeg',
      descripcion: 'El equilibrio perfecto. Variedad para probar el mercado sin una inversión tan grande.',
      precioTotal: '$354.000',
      precioUnitario: '$59.000 c/u',
      mensajeWhatsapp: 'Hola, quiero comprar una caja surtida'
    },
    {
      id: 3,
      titulo: 'Caja cerrada',
      subtitulo: '12 unidades',
      imagen: 'assets/images/12unidmay.jpeg',
      descripcion: 'Nuestro pack estrella, el mismo con el que empezamos a cambiar todo. Inversión mínima, riesgo bajo.',
      precioTotal: '$600.000',
      precioUnitario: '$50.000 c/u',
      mensajeWhatsapp: 'Hola, quiero comprar una caja cerrada'
    }
  ];

  getWhatsappUrl(mensaje: string): string {
    return `${this.whatsappBaseUrl}${encodeURIComponent(mensaje)}`;
  }
}