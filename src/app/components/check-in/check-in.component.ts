import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TitleCasePipe } from '../../pipes/title-case.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.css',  
  imports: [ReactiveFormsModule, CommonModule, TitleCasePipe, RouterModule],
})
export class CheckInComponent implements OnInit {
  registroForm!: FormGroup;  
  fechaRegistro = new Date(); // Variable local
  errorMessage: string = ''; // Para mostrar errores del servidor (Firebase)
  
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService // 🔑 Inyección del AuthService
  ) {}

  ngOnInit(): void {    
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
      aceptaTerminos: [false, Validators.requiredTrue]
    }, {
      // Usamos una función arrow para mantener el contexto 'this' si es necesario, 
      // aunque AbstractControl funciona como control principal
      validator: this.passwordsMatchValidator 
    });
  }

  get form() { return this.registroForm.controls; }
  
  onSubmit(): void {
    this.errorMessage = ''; // Limpiar errores anteriores
    
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrige los errores del formulario para continuar.';
      return;
    }

    const { nombre, apellido, correo, contrasena } = this.registroForm.value;
    const fullName = `${nombre} ${apellido}`; // Se combina para guardarlo en la sesión o Firestore

    // 🔑 Llamada al servicio de autenticación de Firebase
    this.authService.register({ 
      email: correo, 
      password: contrasena, 
      name: fullName // Se pasa el nombre completo
    }).subscribe({
      next: () => {
        // Solicitud del usuario: Redirigir a Login para autenticarse
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error('Registration Error:', err);
        // Mostrar un error amigable de Firebase
        this.errorMessage = this.translateFirebaseError(err.code);
      }
    });
  }
  
  // Validador personalizado para confirmar contraseñas
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('contrasena');
    const confirmPassword = control.get('confirmarContrasena');
    
    // Solo validamos si ambos campos existen y la confirmación ya fue tocada
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        // Establece el error 'mismatch' solo en el control de confirmación
        confirmPassword.setErrors({ mismatch: true });
        return { 'passwordsMismatch': true };
      } else {
        // Si coinciden, limpia el error de 'mismatch' si estaba presente
        if (confirmPassword.errors && confirmPassword.errors['mismatch']) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  // Utilidad para traducir códigos de error de Firebase a mensajes amigables
  private translateFirebaseError(code: string): string {
    switch(code) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está registrado. Por favor, inicia sesión.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil (mínimo 6 caracteres).';
      default:
        return 'Ocurrió un error inesperado al registrarte. Intenta de nuevo.';
    }
  }
}