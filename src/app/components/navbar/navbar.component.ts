import { Component, signal, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TitleCasePipe } from '../../pipes/title-case.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  // Inyección de servicios
  public authService = inject(AuthService);
  private router = inject(Router);

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  }
}
