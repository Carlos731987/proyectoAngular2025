import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  email: string = '';

  // Método simple sin subscribe
  suscribir() {
    if (this.email) {
      console.log('Email suscrito:', this.email);
      alert('¡Gracias por suscribirte!');
      this.email = '';
    }
  }
}