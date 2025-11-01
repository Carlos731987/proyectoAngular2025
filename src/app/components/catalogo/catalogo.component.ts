import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';// Añadimos DecimalPipe para formatear el precio, ya que es un standalone component

// Interfaz para tipar los productos
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {
  // Datos de productos de prueba
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Zapatillas Deportivas X-Run',
      descripcion: 'Diseñadas para máximo rendimiento y comodidad durante el running y entrenamiento. Material transpirable.',
      precio: 89.99,
      imagenUrl: 'https://placehold.co/400x300/f87171/ffffff?text=Deportivas',
    },
    {
      id: 2,
      nombre: 'Bolso de Cuero Italiano Urbano',
      descripcion: 'Bolso de mano y cruzado, perfecto para el uso diario. Cuero genuino importado de Italia.',
      precio: 145.50,
      imagenUrl: 'https://placehold.co/400x300/34d399/ffffff?text=Bolso',
    },
    {
      id: 3,
      nombre: 'Reloj Inteligente Ultra Pro',
      descripcion: 'Monitor de salud avanzado, GPS integrado y batería de larga duración. Compatible con Android e iOS.',
      precio: 199.99,
      imagenUrl: 'https://placehold.co/400x300/60a5fa/ffffff?text=Reloj',
    },
    {
      id: 4,
      nombre: 'Auriculares Inalámbricos Noise-X',
      descripcion: 'Cancelación de ruido activa, sonido de alta fidelidad y estuche de carga rápida.',
      precio: 75.00,
      imagenUrl: 'https://placehold.co/400x300/c084fc/ffffff?text=Audio',
    },
    {
      id: 5,
      nombre: 'Máquina de Café Espresso Compacta',
      descripcion: 'Prepara tu café favorito en segundos. Diseño compacto ideal para cocinas pequeñas.',
      precio: 210.00,
      imagenUrl: 'https://placehold.co/400x300/fde047/333333?text=Cafetera',
    },
    {
      id: 6,
      nombre: 'Mochila Táctica Reforzada',
      descripcion: 'Resistente al agua, múltiples compartimentos para laptop y accesorios, ideal para viajes largos.',
      precio: 55.90,
      imagenUrl: 'https://placehold.co/400x300/fb923c/ffffff?text=Mochila',
    },
  ];
}

