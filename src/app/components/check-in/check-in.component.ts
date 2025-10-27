import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TitleCasePipe } from '../../pipes/title-case.pipe';

@Component({
  standalone: true,
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.css',
  imports: [ReactiveFormsModule, CommonModule,TitleCasePipe],
})
export class CheckInComponent implements OnInit {
  registroForm!: FormGroup;  
  fechaRegistro = new Date();  
  constructor(private fb: FormBuilder, private router: Router) {}

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
      validator: this.passwordsMatchValidator 
    });
  }

  get form() { return this.registroForm.controls; }
  
  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      console.log('Formulario inválido. Revise los errores.');
      return;
    }

    console.log('Registro Exitoso. Datos:', this.registroForm.value);
    
    alert('¡Registro completado! Serás redirigido al inicio de sesión.');
    this.router.navigate(['/iniciar-sesion']);
  }
  
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('contrasena');
    const confirmPassword = control.get('confirmarContrasena');
    
    if (password && confirmPassword && password.value !== confirmPassword.value && confirmPassword.touched) {
      confirmPassword.setErrors({ mismatch: true });
      return { 'passwordsMismatch': true };
    } else if (confirmPassword && confirmPassword.errors && confirmPassword.errors['mismatch']) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
}