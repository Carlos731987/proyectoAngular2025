// Servicio encargado de manejar la autenticación de usuarios con Firebase.
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
import { environment } from '../../environments/environment';

declare const __firebase_config: string;
declare const __initial_auth_token: string;

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;

/**
 * Determina qué configuración de Firebase usar: Plataforma (Deploy) o Local (environment.ts).
 */
const getFinalFirebaseConfig = () => {
  const firebaseConfigPlatform = typeof __firebase_config !== 'undefined'? JSON.parse(__firebase_config): null;

  if (firebaseConfigPlatform) {
    console.log("Usando credenciales de Firebase Hosting (Entorno de Deploy).");
    return firebaseConfigPlatform;
  }
  
  if (environment.firebase) {
    console.warn("Configuración de Firebase usando environment.ts (Entorno Local).");
    return environment.firebase;
  }  
  return null;
};

const firebaseConfigFinal = getFinalFirebaseConfig();

try {
  if (firebaseConfigFinal) {
    firebaseApp = initializeApp(firebaseConfigFinal);
    firebaseAuth = getAuth(firebaseApp);
  } else {
    console.warn("No se encontró configuración de Firebase. La autenticación estará inactiva.");
  }
} catch (e) {
  console.error("Fallo al inicializar Firebase:", e);
  firebaseAuth = undefined;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null | undefined>(undefined);
  public readonly loading = signal(true);
  
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._currentUser());

  private auth: Auth | undefined = firebaseAuth;

  constructor() {
    if (this.auth) {      
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
      this._currentUser.set(null);
      this.loading.set(false);
    }
  }

  /**
   * Registra un nuevo usuario con email, contraseña y nombre visible.Devuelve un Observable (de Promise) para compatibilidad con .subscribe() en componentes.
   */
  
  register({ email, password, name }: { email: string, password: string, name: string }): Observable<UserCredential> {
    if (!this.auth) return from(Promise.reject(new Error("Firebase Auth no está inicializado.")));

    const registrationPromise = createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {  
        await updateProfile(userCredential.user, { displayName: name });        
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