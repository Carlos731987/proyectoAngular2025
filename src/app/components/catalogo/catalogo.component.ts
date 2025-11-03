import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common'; // Añadimos DecimalPipe para formatear el precio, ya que es un standalone component

// Interfaz para tipar los productos
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  tallesDisponibles: { [talle: number]: boolean };
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoComponent {
  catalogo: { [categoria: string]: Producto[] } = {
    hombre: [
      {
        id: 1,
        nombre: 'ZAPATILLAS DE RUNNING ADIDAS RUNFALCON 5 GRIS',
        descripcion:
          'Tanto en la pista como en la cinta de correr, alcanzá todas tus metas con estas zapatillas de running ADIDAS.',
        precio: 150000,
        imagenUrl: 'assets/zapatillas/hombre/runfalcon.png',
        tallesDisponibles: { 38: true, 39: true, 40: true, 41: false },
      },
      {
        id: 2,
        nombre: 'ZAPATILLAS NEW BALANCE 1906R CEMENTO',
        descripcion:
          'Estas zapatillas se han diseñado con características que les aportan la máxima comodidad y una tecnología prémium para mantener el ritmo de tu activo estilo de vida. La entresuela ABZORB absorbe los impactos mediante una combinación de amortiguación y compresión.',
        precio: 296000,
        imagenUrl: 'assets/zapatillas/hombre/1906R CEMENTO.png',
        tallesDisponibles: { 39: true, 40: true, 41: true, 42: true },
      },
      {
        id: 3,
        nombre: 'ZAPATILLAS ADIDAS BAREEDA BLANCA',
        descripcion:
          'Debido a la naturaleza de exclusiva calidad de los materiales, podría ocurrir que en algunos casos el producto destiñera levemente, sobre todo en condiciones de humedad.',
        precio: 320000,
        imagenUrl: 'assets/zapatillas/hombre/Bereeda.png',
        tallesDisponibles: { 38: true, 41: true, 39: false, 43: true },
      },
      {
        id: 4,
        nombre: 'ZAPATILLAS DE ENTRENAMIENTO NIKE UPLIFT SC NEGRO',
        descripcion:
          'El diseño elegante y las combinaciones de colores fáciles de combinar te harán buscarlo una y otra vez.',
        precio: 140000,
        imagenUrl: 'assets/zapatillas/hombre/UPLIFT SC.png',
        tallesDisponibles: { 39: true, 40: true, 41: true, 42: false },
      },
    ],
    mujer: [
      {
        id: 400,
        nombre: 'ZAPATILLAS DE RUNNING ADIDAS ULTRABOUNCE MUJER CRUDO',
        descripcion:
          'La mediasuela Bounce ligera proporciona comodidad, amortiguación y flexibilidad a tu pisada para poder añadir kilómetros a tu carrera diaria. La suela de caucho de gran resistencia al desgaste garantiza una excelente tracción en una gran variedad de superficies.',
        precio: 190000.0,
        imagenUrl: 'assets/zapatillas/mujer/ultrabounce.png',
        tallesDisponibles: { 39: true, 40: true, 41: true, 42: false },
      },
      {
        id: 401,
        nombre: 'ZAPATILLAS DE RUNNING UNDER ARMOUR VELOCITI 3 MUJER NEGRA',
        descripcion:
          'Ligera, sin goma y duradera, nuestra amortiguación más nueva brinda una sensación de velocidad con agarre y cercanía al suelo mientras entrenas para darlo todo.',
        precio: 132000.0,
        imagenUrl: 'assets/zapatillas/mujer/velociti.png',
        tallesDisponibles: { 39: true, 40: true, 41: true, 42: false },
      },
      {
        id: 402,
        nombre: 'ZAPATILLAS DE RUNNING PUMA DEVIATE NITRO 2 MUJER LILA',
        descripcion:
          'Las Deviate NITRO™ 2 son una mejora notable de nuestras galardonadas zapatillas de entrenamiento de alto rendimiento.',
        precio: 110000.0,
        imagenUrl: 'assets/zapatillas/mujer/Nitro2.png',
        tallesDisponibles: { 39: true, 40: true, 41: true, 42: false },
      },
      {
        id: 403,
        nombre: 'ZAPATILLAS DE VOLEY ASICS GEL-REBOUND MUJER AZUL',
        descripcion:
          'Este modelo liviano y duradero está diseñado pensando en su comodidad y resistencia, para que puedas alcanzar tu máximo potencial.',
        precio: 99000.0,
        imagenUrl: 'assets/zapatillas/mujer/voley.png',
        tallesDisponibles: { 36: true, 37: true, 38: true, 40: false },
      },
    ],
    juvenil: [
      {
        id: 50,
        nombre: 'Zapatillas Jordan AIR 1 LOW NIÑOS',
        descripcion:
          ' Las Air Jordan 1 Low combinan el diseño clásico que marcó una era con materiales premium que brindan durabilidad y confort.',
        precio: 105000,
        imagenUrl: 'assets/zapatillas/juvenil/jordan.png',
        tallesDisponibles: { 29: true, 31: true, 32: true, 34: false },
      },
      {
        id: 51,
        nombre: 'ZAPATILLAS NIKE SPORTSWEAR AIR FORCE 1 LV8 4 NIÑOS',
        descripcion:
          'Los clásicos AF1 están confeccionados en cuero de alta calidad para ofrecer durabilidad y un estilo que nunca pasa de moda.',
        precio: 120000.0,
        imagenUrl: 'assets/zapatillas/juvenil/nike.png',
        tallesDisponibles: { 29: true, 31: true, 32: true, 34: false },
      },
      {
        id: 52,
        nombre: 'ZAPATILLAS KAPPA LOGO ADENIS 2 NIÑO NIÑA NEGRA',
        descripcion:
          'Capellada: Cuero sintetico. Suela: sintetica, origen: Bangladesh.',
        precio: 89000.0,
        imagenUrl: 'assets/zapatillas/juvenil/adenis .png',
        tallesDisponibles: { 29: true, 31: true, 32: true, 34: false },
      },
      {
        id: 53,
        nombre: 'ZAPATILLAS ADIDAS ADIFOM SAMBA NIÑOS',
        descripcion:
          'Estas zapatillas adidas Disney para niños reinventan las icónicas Samba con un toque divertido y pensado para los más chico',
        precio: 130000.0,
        imagenUrl: 'assets/zapatillas/juvenil/samba.png',
        tallesDisponibles: { 29: false, 31: false, 32: false, 34: false },
      },
    ],
  };
  objectKeys = Object.keys;
}
