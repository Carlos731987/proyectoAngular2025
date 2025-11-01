import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgClass],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  async onSubmit() {
    this.errorMessage.set(null); 
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (email && password) {
        try {
          await this.authService.login({ email, password });
          this.router.navigate(['/']); 
        } catch (e: any) {
          this.errorMessage.set(e.message || 'Error al iniciar sesión. Por favor, intente de nuevo.');
        }
      }
    }
  }
}