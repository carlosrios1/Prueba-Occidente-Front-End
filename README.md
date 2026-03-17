# Prueba Occidente — Frontend

Aplicación web de gestión de sorteos desarrollada con **Angular 17** como prueba técnica para Banco de Occidente. Permite administrar transacciones/lotes, premios, sorteos y generar reportes de resultados.

---

## Tecnologías principales

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 17.3 | Framework principal (standalone components + Signals) |
| TypeScript | 5.4 | Lenguaje de programación |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| FlyonUI | 1.3 | Biblioteca de componentes UI |
| Lucide Angular | 0.522 | Iconografía |
| RxJS | 7.8 | Reactividad y comunicación HTTP |

---

## Requisitos previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 17.x
- Backend corriendo en `http://localhost:5130`

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd Prueba-Occidente-Front-End

# Instalar dependencias
npm install
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Levanta el servidor de desarrollo en `http://localhost:4200` |
| `npm run build` | Compila la aplicación para producción |
| `npm run watch` | Compila en modo watch para desarrollo |
| `npm test` | Ejecuta las pruebas unitarias con Karma |

---

## Variables de entorno

Los archivos de entorno se ubican en `src/environments/`:

```typescript
// environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5130'
};
```

```typescript
// environment.prod.ts (producción)
export const environment = {
  production: true,
  apiUrl: '<URL_DE_PRODUCCION>'
};
```

---

## Arquitectura del proyecto

El proyecto sigue una arquitectura **feature-based** con separación clara de responsabilidades:

```
src/app/
├── core/               # Infraestructura transversal
│   ├── config/         # Configuración del sidebar
│   ├── guards/         # Guardias de rutas (auth)
│   ├── interceptors/   # HTTP interceptors (auth, errores)
│   ├── layout/         # Layouts principales (default, login)
│   └── models/         # Modelos base (API response, paginación, usuario)
│
├── features/           # Módulos de negocio
│   ├── auth/           # Login y registro
│   ├── awards/         # Gestión de premios
│   ├── giveaways/      # Gestión de sorteos
│   ├── lots/           # Transacciones y lotes
│   └── reports/        # Reportes de transacciones y ganadores
│
└── shared/             # Componentes, directivas y servicios reutilizables
    ├── components/     # UI Components (buttons, modals, tables, forms, etc.)
    ├── directives/     # Directivas personalizadas
    └── pagination.service.ts
```

### Estructura estándar de cada feature

```
feature-name/
├── components/         # Componentes de presentación (tablas, modales, forms)
├── models/             # Interfaces y tipos del dominio
├── pages/              # Componentes de página (smart components)
└── services/
    ├── *-http.service.ts    # Llamadas HTTP al backend
    └── *-state.service.ts   # Estado con Angular Signals
```

---

## Funcionalidades

### Autenticación
- Inicio de sesión con JWT
- Registro de usuarios
- Protección de rutas con `authGuard`
- Interceptor para adjuntar token en cada petición

### Premios (`/awards`)
- Listado paginado de premios
- Crear, editar y eliminar premios
- Formulario en modal

### Lotes y Transacciones (`/lots`)
- Página principal de lotes
- Listado de todos los lotes
- Listado de transacciones
- Carga de lotes mediante archivo

### Sorteos (`/giveaways`)
- Listado de sorteos existentes
- Creación de nuevos sorteos
- Vista detallada del sorteo con gestión de premios asociados
- Animación de confeti al realizar un sorteo

### Reportes (`/reports`)
- Reporte de transacciones
- Reporte de ganadores

---

## Patrones de desarrollo

### Gestión de estado (Angular Signals)

```typescript
@Injectable()
export class FeatureStateService {
  private _state = signal<FeatureState>({ ... });
  readonly state = this._state.asReadonly();

  readonly items = computed(() => this._state().items);
  readonly isLoading = computed(() => this._state().isLoading);

  private patch(partial: Partial<FeatureState>): void {
    this._state.update(s => ({ ...s, ...partial }));
  }

  async loadItems(): Promise<void> {
    this.patch({ isLoading: true });
    try {
      const res = await firstValueFrom(this.http.getAll());
      if (res.success) this.patch({ items: res.data });
    } finally {
      this.patch({ isLoading: false });
    }
  }
}
```

### Servicios HTTP

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureHttpService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/feature`;

  getAll(page: number): Observable<PaginatedData<Item>> {
    return this.http.get<Response<PaginatedData<Item>>>(this.baseUrl)
      .pipe(map(res => res.data));
  }
}
```

---

## Rutas de la aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/log-in` | `LogInComponent` | Inicio de sesión |
| `/register` | `RegisterComponent` | Registro de usuario |
| `/lots` | `LotsMainPageComponent` | Panel principal de lotes |
| `/lots/all` | `AllLotsPageComponent` | Listado de lotes |
| `/lots/transactions` | `AllTransactionsPageComponent` | Listado de transacciones |
| `/lots/upload` | `UploadLotPageComponent` | Carga de lotes |
| `/awards` | `AwardListPageComponent` | Gestión de premios |
| `/giveaways` | `GiveawayListPageComponent` | Listado de sorteos |
| `/giveaways/new` | `GiveawayCreatePageComponent` | Crear sorteo |
| `/giveaways/:id` | `GiveawayDetailPageComponent` | Detalle de sorteo |
| `/reports` | `ReportMainPageComponent` | Panel de reportes |
| `/reports/transactions` | `ReportTransactionsPageComponent` | Reporte de transacciones |
| `/reports/winners` | `ReportWinnersPageComponent` | Reporte de ganadores |

---

## Construcción para producción

```bash
npm run build
```

Los artefactos de compilación se almacenan en el directorio `dist/`. Asegúrate de configurar correctamente `environment.prod.ts` antes de compilar.

---

## Pruebas

```bash
npm test
```

Las pruebas unitarias se ejecutan con [Karma](https://karma-runner.github.io) y [Jasmine](https://jasmine.github.io/).
