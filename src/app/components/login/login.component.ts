import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgClass],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = signal<string | null>(null);
  
  isSubmitting = signal(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  onSubmit(event: Event) {
    event.preventDefault();

    this.errorMessage.set(null);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('Por favor, ingrese credenciales válidas.');      
      return;
    }

    this.isSubmitting.set(true);

    const { email, password } = this.loginForm.value;
    if (email && password) {      
      this.authService
        .login({ email, password })
        .pipe(take(1))
        .subscribe({
          next: () => {
            // Éxito: Redirige a Home
            this.router.navigate(['/']);
          },
          error: (e) => {            
            this.isSubmitting.set(false);
            this.errorMessage.set(this.translateFirebaseError(e.code));
            console.error('Login Error (RxJS):', e);
          },
          complete: () => {            
            this.isSubmitting.set(false);
          },
        });
    } else {      
      this.isSubmitting.set(false);
    }
  }

  private translateFirebaseError(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Credenciales incorrectas. Verifique su email y contraseña.';
      case 'auth/user-disabled':
        return 'Su cuenta ha sido deshabilitada por el administrador.';
      default:
        return 'Error al iniciar sesión. Intente de nuevo o regístrese.';
    }
  }
}
