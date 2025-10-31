import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta es correcta
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // --- Lógica de la función ---
  onSubmit(): void {
    this.errorMessage = ''; // Limpiar errores anteriores

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, introduce credenciales válidas.';
      return;
    }

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Asumiendo que el servicio guarda el token y/o estado de usuario
        console.log('Login exitoso:', response);
        this.router.navigate(['/home']); // Redirigir al inicio o dashboard
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        // Mostrar un mensaje de error más amigable
        this.errorMessage = err.error?.message || 'Email o contraseña incorrectos.';
      }
    });
  }

  // Helper para acceder fácilmente a los controles del formulario
  get f() { return this.loginForm.controls; }
}
