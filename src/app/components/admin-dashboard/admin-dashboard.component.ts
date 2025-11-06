import { Component, OnInit, inject, signal, computed, DestroyRef, OnDestroy } from '@angular/core';
import { CommonModule, NgClass, DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, effect } from '@angular/core';

// --- COMPONENTES DE LAYOUT (Aseguran que Navbar y Footer se vean) ---
// NOTA: Asegure que estas rutas de importación sean válidas en su proyecto
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

// --- SERVICIOS/INFRAESTRUCTURA ---
import { AuthService } from '../../services/auth.service';

// --- FIREBASE IMPORTS (Firestore y Auth para inicialización) ---
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, Unsubscribe, Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// --- INTERFACES DE DATOS ---
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  price: number;
}

interface Client {
  id: string;
  email: string;
  fullName: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  lastLogin: Date; 
}

// --- CONSTANTES GLOBALES (Inyectadas por el entorno de la plataforma) ---
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // Incluimos NavbarComponent y FooterComponent para que se muestren
  imports: [CommonModule, ReactiveFormsModule, NgClass, DatePipe, DecimalPipe, NavbarComponent, FooterComponent], 
  template: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  // --- INYECCIONES Y CONSTANTES ---
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  
  // Email del administrador para verificación
  readonly ADMIN_EMAIL = 'admin@importsbrisaydenis.com.ar';
  
  // Firestore
  private db!: Firestore;
  private unsubscribers: Unsubscribe[] = [];
  
  // Variables globales
  appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  
  // --- ESTADO Y VISTAS ---
  isAuthReady = signal(false);
  selectedView = signal<'catalogo' | 'clientes'>('catalogo');
  isAdministrator = computed(() => this.authService.currentUser()?.email === this.ADMIN_EMAIL);

  // --- ESTADO DE DATOS (SIGNALS) ---
  products = signal<Product[]>([]);
  clients = signal<Client[]>([]);
  productsLoading = signal(true);
  clientsLoading = signal(true);

  // --- ESTADO DE CRUD Y MODAL ---
  showProductModal = signal(false);
  currentProductId = signal<string | null>(null);
  showClientModal = signal(false);
  currentClientId = signal<string | null>(null);
  isSaving = signal(false);
  crudError = signal<string | null>(null);

  // --- FORMULARIOS ---
  productForm: FormGroup;
  clientForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });

    this.clientForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['Activo', Validators.required],
    });
    
    // Observa el estado de autenticación para decidir si configurar Firestore
    effect(() => {
        const currentUser = this.authService.currentUser();
        const loading = this.authService.loading();

        if (!loading) {
            this.isAuthReady.set(true);
            if (currentUser && currentUser.email === this.ADMIN_EMAIL) {
                this.initFirebase();
            } else if (currentUser && currentUser.email !== this.ADMIN_EMAIL) {
                console.error("Usuario logueado no es administrador.");
            }
        }
    });

    // Si el usuario deja de ser admin, forzar redirección
    effect(() => {
        if (this.isAuthReady() && !this.isAdministrator() && this.authService.currentUser() !== undefined) {
            if (this.authService.currentUser() !== null) {
              this.router.navigate(['/somos']);
            }
        }
    });
  }

  // --- LIFECYCLE HOOKS ---
  ngOnInit(): void {
    if (!this.authService.loading() && this.isAdministrator()) {
        this.initFirebase();
    }
  }

  ngOnDestroy(): void {
      this.unsubscribers.forEach(unsub => unsub());
  }

  // --- FIREBASE SETUP ---
  async initFirebase(): Promise<void> {
    try {
      const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

      if (Object.keys(firebaseConfig).length === 0) {
        console.error("Configuración de Firebase no disponible para el Dashboard.");
        return;
      }

      const app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
      
      this.setupFirestoreListeners();

    } catch (error) {
      console.error("Error al inicializar Firebase o conectar Firestore:", error);
    }
  }

  // --- FIREBASE LISTENERS ---
  setupFirestoreListeners(): void {
    if (!this.db) {
        console.error("Firestore no está inicializado.");
        return;
    }
    
    // 1. Suscriptor de Catálogo
    const productsCollectionRef = collection(this.db, `artifacts/${this.appId}/public/data/products`);
    const unsubscribeProducts = onSnapshot(productsCollectionRef, (snapshot) => {
      const newProducts: Product[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        newProducts.push({
          id: doc.id,
          name: data['name'] || 'Sin Nombre',
          brand: data['brand'] || 'N/A',
          category: data['category'] || 'General',
          stock: data['stock'] || 0,
          price: data['price'] || 0,
        });
      });
      this.products.set(newProducts);
      this.productsLoading.set(false);
    }, (error) => {
      console.error("Error al escuchar productos:", error);
      this.productsLoading.set(false);
      this.crudError.set("Fallo al cargar catálogo. Verifique reglas de seguridad.");
    });
    this.unsubscribers.push(unsubscribeProducts);
    
    // 2. Suscriptor de Clientes
    const clientsCollectionRef = collection(this.db, `artifacts/${this.appId}/public/data/clients`);
    const unsubscribeClients = onSnapshot(clientsCollectionRef, (snapshot) => {
      const newClients: Client[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const lastLoginValue = data['lastLogin']?.toDate ? data['lastLogin'].toDate() : new Date();
        
        newClients.push({
          id: doc.id,
          fullName: data['fullName'] || 'Cliente Nuevo',
          email: data['email'] || 'sin@email.com',
          status: data['status'] || 'Pendiente',
          lastLogin: lastLoginValue,
        });
      });
      this.clients.set(newClients);
      this.clientsLoading.set(false);
    }, (error) => {
      console.error("Error al escuchar clientes:", error);
      this.clientsLoading.set(false);
      this.crudError.set("Fallo al cargar clientes. Verifique reglas de seguridad.");
    });
    this.unsubscribers.push(unsubscribeClients);
  }

  // --- LÓGICA DE VISTA ---
  selectView(view: 'catalogo' | 'clientes'): void {
    this.selectedView.set(view);
    this.crudError.set(null); // Limpiar errores al cambiar de vista
  }

  // --- DASHBOARD DE CATÁLOGO (COMPUTED SIGNALS) ---
  totalProducts = computed(() => this.products().length);
  totalStock = computed(() => this.products().reduce((sum, p) => sum + p.stock, 0));
  totalBrands = computed(() => new Set(this.products().map(p => p.brand)).size);
  topCategory = computed(() => {
    const categories = this.products().map(p => p.category);
    const counts: { [key: string]: number } = {};
    categories.forEach(cat => counts[cat] = (counts[cat] || 0) + 1);
    const sorted = Object.entries(counts).sort(([, countA], [, countB]) => countB - countA);
    return sorted.length > 0 ? sorted[0][0] : null;
  });

  // --- DASHBOARD DE CLIENTES (COMPUTED SIGNALS) ---
  totalClients = computed(() => this.clients().length);
  activeClients = computed(() => this.clients().filter(c => c.status === 'Activo').length);
  inactiveClients = computed(() => this.clients().filter(c => c.status === 'Inactivo').length);
  pendingClients = computed(() => this.clients().filter(c => c.status === 'Pendiente').length);

  // --- CRUD DE CATÁLOGO (Producto) ---
  openProductModal(product?: Product): void {
    this.crudError.set(null);
    if (product) {
      this.currentProductId.set(product.id);
      this.productForm.patchValue(product); // Usamos patchValue para ser más seguro
    } else {
      this.currentProductId.set(null);
      this.productForm.reset({ stock: 0, price: 0 });
    }
    this.showProductModal.set(true);
  }

  closeProductModal(): void {
    this.showProductModal.set(false);
    this.currentProductId.set(null);
    this.crudError.set(null);
  }

  async saveProduct(): Promise<void> {
    this.crudError.set(null);
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.crudError.set("Por favor, complete todos los campos requeridos.");
      return;
    }

    this.isSaving.set(true);
    const data = this.productForm.value;
    const productsCollectionRef = collection(this.db, `artifacts/${this.appId}/public/data/products`);
    
    try {
      if (this.currentProductId()) {
        const productDocRef = doc(productsCollectionRef, this.currentProductId()!);
        await updateDoc(productDocRef, data);
        console.log(`Producto actualizado: ${this.currentProductId()}`);
      } else {
        await addDoc(productsCollectionRef, data);
        console.log('Producto agregado.');
      }
      this.closeProductModal();
    } catch (e: any) {
      this.crudError.set(`Error al guardar: ${e.message}`);
      console.error("Error al guardar producto:", e);
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;
    this.crudError.set(null);
    this.isSaving.set(true);
    
    try {
      const productDocRef = doc(this.db, `artifacts/${this.appId}/public/data/products`, id);
      await deleteDoc(productDocRef);
      console.log(`Producto eliminado: ${id}`);
    } catch (e: any) {
      this.crudError.set(`Error al eliminar: ${e.message}`);
      console.error("Error al eliminar producto:", e);
    } finally {
      this.isSaving.set(false);
    }
  }

  // --- CRUD DE CLIENTES (Cliente) ---
  openClientModal(client?: Client): void {
    this.crudError.set(null);
    if (client) {
      this.currentClientId.set(client.id);
      this.clientForm.patchValue(client);
    } else {
      this.currentClientId.set(null);
      this.clientForm.reset({ status: 'Activo' });
    }
    this.showClientModal.set(true);
  }

  closeClientModal(): void {
    this.showClientModal.set(false);
    this.currentClientId.set(null);
    this.crudError.set(null);
  }

  async saveClient(): Promise<void> {
    this.crudError.set(null);
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.crudError.set("Por favor, complete todos los campos requeridos.");
      return;
    }

    this.isSaving.set(true);
    const data = this.clientForm.value;
    const clientsCollectionRef = collection(this.db, `artifacts/${this.appId}/public/data/clients`);
    
    try {
      if (this.currentClientId()) {
        const clientDocRef = doc(clientsCollectionRef, this.currentClientId()!);
        await updateDoc(clientDocRef, data);
        console.log(`Cliente actualizado: ${this.currentClientId()}`);
      } else {
        await addDoc(clientsCollectionRef, { ...data, lastLogin: new Date() });
        console.log('Cliente agregado.');
      }
      this.closeClientModal();
    } catch (e: any) {
      this.crudError.set(`Error al guardar: ${e.message}`);
      console.error("Error al guardar cliente:", e);
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteClient(id: string): Promise<void> {
    if (!confirm('¿Está seguro de que desea eliminar este cliente y sus datos? (Esto NO elimina la cuenta de Firebase Auth)')) return;
    this.crudError.set(null);
    this.isSaving.set(true);
    
    try {
      const clientDocRef = doc(this.db, `artifacts/${this.appId}/public/data/clients`, id);
      await deleteDoc(clientDocRef);
      console.log(`Cliente eliminado: ${id}`);
    } catch (e: any) {
      this.crudError.set(`Error al eliminar cliente: ${e.message}`);
      console.error("Error al eliminar cliente:", e);
    } finally {
      this.isSaving.set(false);
    }
  }
}