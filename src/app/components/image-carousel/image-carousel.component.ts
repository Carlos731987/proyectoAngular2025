import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [],
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent implements OnInit {
  images = [
    {
      src: 'assets/images/paga.jpeg',
      alt: 'PAGÁ COMO QUIERAS'
    },
    {
      src: 'assets/images/envdom.jpeg',
      alt: 'ENVIOS A DOMICILIO'
    },
    {
      src: 'assets/images/compra.jpeg',
      alt: 'COMPRA CON SEGURIDAD'
    }
  ];

  currentIndex = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}