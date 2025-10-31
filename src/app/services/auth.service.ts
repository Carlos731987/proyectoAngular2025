import { Injectable, signal, computed, inject, Injector } from '@angular/core';
import { from, Observable, filter, map, take } from 'rxjs';
import {
  getAuth,
  Auth,
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithCustomToken,
  signInAnonymously,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { initializeApp, FirebaseApp } from 'firebase/app';

// --- CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE (FUERA DE LA CLASE) ---

// Las variables globales son proporcionadas por el entorno de la plataforma.
declare const __firebase_config: string;
declare const __initial_auth_token: string;

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;

try {
  if (firebaseConfig) {    
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);

    // 2. Proceso de autenticación inicial asíncrona
    const authInstance = firebaseAuth; // Usar una constante local para claridad
    
    // Función para manejar el inicio de sesión
    const handleAuth = async () => {
      if (initialAuthToken) {
        try {
          await signInWithCustomToken(authInstance, initialAuthToken);
        } catch (e) {
          console.warn("Fallo en Custom Token. Intentando anónimamente.", e);
          await signInAnonymously(authInstance);
        }
      } else {
        await signInAnonymously(authInstance);
      }
    };
    handleAuth().catch(err => console.error("Error en la autenticación inicial:", err));

  } else {
    console.warn("Configuración de Firebase no disponible. La autenticación estará inactiva en el entorno local.");
  }
} catch (e) {
  console.error("Fallo al inicializar Firebase:", e);
  firebaseAuth = undefined; // Aseguramos que sea undefined si hay un fallo
}


// --- SERVICIO DE AUTENTICACIÓN (AuthService) ---

/**
 * Servicio encargado de manejar la autenticación de usuarios con Firebase.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signals para el estado
  private readonly _currentUser = signal<User | null | undefined>(undefined); // undefined: cargando
  public readonly loading = signal(true);

  // Señales públicas y computadas
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._currentUser());

  // Referencia a la instancia de Auth (puede ser undefined si falló la inicialización)
  private auth: Auth | undefined = firebaseAuth;

  constructor() {
    // ESTE ES EL BLOQUE CRÍTICO: SOLO intenta escuchar si la instancia 'auth' es válida
    if (this.auth) {
      // Escucha los cambios de estado de autenticación en Firebase
      onAuthStateChanged(this.auth, (user) => {
        this._currentUser.set(user);
        this.loading.set(false);
        if (user) {
          console.log("Usuario autenticado. UID:", user.uid, "Nombre:", user.displayName);
        } else {
          console.log("Usuario desautenticado.");
        }
      });
    } else {
      // Si FirebaseAuth no existe (fallo en local), establecemos el estado final inmediatamente
      this._currentUser.set(null);
      this.loading.set(false);
    }
  }

  /**
   * Registra un nuevo usuario con email, contraseña y nombre visible.
   * Devuelve un Observable (de Promise) para compatibilidad con .subscribe() en componentes.
   */
  register({ email, password, name }: { email: string, password: string, name: string }): Observable<UserCredential> {
    if (!this.auth) return from(Promise.reject(new Error("Firebase Auth no está inicializado.")));

    const registrationPromise = createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        // 1. Actualiza el perfil del usuario con el nombre
        await updateProfile(userCredential.user, { displayName: name });
        // 2. Sincroniza el estado de la señal _currentUser manualmente
        this._currentUser.set(userCredential.user);
        return userCredential;
      });

    return from(registrationPromise);
  }

  /**
   * Inicia sesión con email y contraseña.
   * Devuelve un Observable (de Promise).
   */
  login({ email, password }: { email: string, password: string }): Observable<UserCredential> {
    if (!this.auth) return from(Promise.reject(new Error("Firebase Auth no está inicializado.")));
    const loginPromise = signInWithEmailAndPassword(this.auth, email, password);
    return from(loginPromise);
  }

  /**
   * Cierra la sesión del usuario.
   */
  async logout(): Promise<void> {
    if (!this.auth) throw new Error("Firebase Auth no está inicializado.");
    return signOut(this.auth);
  }
}