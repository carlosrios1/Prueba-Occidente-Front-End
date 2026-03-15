# Copilot Instructions — Prueba Práctica Programador Jr.

## Descripción general del proyecto

aplicación web Angular que consume una API REST ya construida en **.NET 8 (Clean Architecture + Dapper + SQL Server)**.  
El objetivo es implementar un sistema de **gestión de sorteos** para una entidad financiera, con las siguientes funcionalidades:

- Autenticación con JWT
- Gestión de premios (Awards)
- Carga de lotes de transacciones desde Excel (Lots)
- Creación y ejecución de sorteos (Giveaways)
- Reportes de transacciones y ganadores (JSON · Excel · PDF)

---

## Stack tecnológico (Frontend)

| Herramienta | Versión | Uso |
|---|---|---|
| Angular | 17 | Framework principal (standalone components) |
| Tailwind CSS | 3 | Estilos utilitarios |
| FlyonUI | 1.3 | Librería de componentes UI sobre Tailwind |
| Lucide Angular | latest | Iconografía |
| RxJS | 7.8 | Manejo de streams y HTTP |
| TypeScript | 5.4 | Tipado estático |

**Todos los componentes son `standalone: true`.**  
No usar NgModules. Usar `inject()` para inyección de dependencias en lugar del constructor cuando sea posible.

---

## API Backend

> **Ante cualquier duda sobre contratos de la API (campos, tipos, estructura de respuesta), consultar siempre el archivo `postman/Prueba-Occidente-API.postman_collection.json`** antes de asumir la estructura.

- **Base URL:** `http://localhost:5130`
- **Autenticación:** Bearer JWT — el token se obtiene en login y debe enviarse en el header `Authorization: Bearer <token>`
- **Formato estándar de respuesta:**

```ts
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}
```

- **Formato de paginación (data):** — devuelto por Awards, Lots, Giveaways y Transactions:

```ts
interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
```

- **Formato de paginación extendido** — devuelto únicamente por `/api/reports/transactions` (JSON):

```ts
interface PaginatedReportData<T> extends PaginatedData<T> {
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

### Códigos de error del middleware

| Código | Causa |
|---|---|
| 400 | ArgumentException — validación de campos |
| 401 | UnauthorizedAccessException — token inválido o credenciales incorrectas |
| 404 | KeyNotFoundException — recurso no encontrado |
| 409 | InvalidOperationException — conflicto de negocio |
| 408 | TimeoutException |
| 503 | HttpRequestException |
| 500 | Error inesperado del servidor |

---

## Módulos de la API

### 1. Auth — `/api/auth`

> No requieren token.

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | `{ username, password }` | Devuelve JWT. `data: { token, expiresAt, user }` |
| POST | `/api/auth/register` | `{ username, password }` | Crea usuario. `data: { id, username, isActive, createdAt }` |

- `password` debe cumplir: mínimo 8 caracteres, letras, números y símbolo especial (ej. `Admin123!`).
- Error 409 si el username ya existe.

---

### 2. Awards (Premios) — `/api/awards`

> Requieren JWT. CRUD completo.

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/api/awards?page=1&pageSize=10` | — | Lista paginada de premios |
| GET | `/api/awards/:id` | — | Detalle de un premio |
| POST | `/api/awards` | `{ awardname, description }` | Crea premio ⚠️ campo `awardname` en minúscula |
| PUT | `/api/awards/:id` | `{ awardName, description }` | Actualiza ⚠️ campo `awardName` con N mayúscula |
| DELETE | `/api/awards/:id` | — | Elimina. Error 409 si está en uso por un sorteo |

**Modelo:**
```ts
interface Award {
  id: number;
  awardName: string;
  description: string;
}
```

**Seed inicial:**
- ID 1 — Premio Mayor — Viaje todo incluido para dos personas  
- ID 2 — Segundo Premio — Televisor Smart TV 55 pulgadas  
- ID 3 — Tercer Premio — Smartphone última generación  
- ID 4 — Mención de Honor — Gift card L. 1,000

---

### 3. Lots (Lotes) — `/api/lots`

> Requieren JWT.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/lots?page=1&pageSize=10` | Lista paginada de lotes |
| GET | `/api/lots/:id` | Detalle de un lote |
| GET | `/api/lots/transactions?page=1&pageSize=20` | Todas las transacciones del sistema |
| POST | `/api/lots/upload` | Sube Excel (`multipart/form-data`, campo `file`) |

**Modelo Lote:**
```ts
interface Lot {
  id: number;
  fileName: string;
  uploadDate: string; // ISO datetime
  totalRecords: number;
  status: 'PENDING' | 'COMPLETED';
  uploadedBy: string;   // username del usuario que subió el lote
  transactions: any[];  // array (vacío en listados)
}
```

**Modelo Transacción:**
```ts
interface Transaction {
  id: number;
  clientCode: string;
  clientName: string;
  loteId: number;
  transactionDate: string;
  amount: number;
  currency: string;
  description: string;
  authNumber: string;
}
```

**Comportamiento del upload:**
1. Parsea el Excel detectando columnas por alias (español/inglés)
2. Valida códigos de cliente contra BD
3. Omite duplicados por `authNumber`
4. Registra el lote como `COMPLETED`

**Columnas requeridas del Excel:**

| Columna | Alias aceptados |
|---|---|
| Código de Cliente | clientCode, código, client_code |
| Nombre del Cliente | clientName, nombre, client_name |
| Fecha de Transacción | transactionDate, fecha, transaction_date |
| Monto | amount, monto |
| Moneda | currency, moneda |
| Comercio/Descripción | description, descripción, comercio |
| Número de Autorización | authNumber, autorización, auth_number |

---

### 4. Giveaways (Sorteos) — `/api/giveaways`

> Requieren JWT. CRUD + ejecución.

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| GET | `/api/giveaways?page=1&pageSize=10` | — | Lista paginada |
| GET | `/api/giveaways/:id` | — | Detalle con premios asociados |
| POST | `/api/giveaways` | Ver abajo | Crea sorteo |
| PUT | `/api/giveaways/:id` | `{ giveawayDate, trStartDate, trEndDate, description }` | Actualiza fechas y descripción |
| DELETE | `/api/giveaways/:id` | — | Elimina |
| POST | `/api/giveaways/:id/run` | — | **Ejecuta el sorteo** |

**Body crear sorteo:**
```ts
{
  giveAwayDate: string;  // datetime ISO
  trStartDate: string;   // datetime ISO
  trEndDate: string;     // datetime ISO
  description: string;
  awards: Array<{
    awardId: number;
    winnersQuant: number;
  }>;
}
```

**Modelo Sorteo (détalle):**
```ts
interface Giveaway {
  id: number;
  giveawayDate: string;
  trStartDate: string;
  trEndDate: string;
  description: string;
  awards: Array<{
    id: number;
    awardId: number;
    awardName: string;
    winnersQuant: number;
  }>;
}
```

**Respuesta ejecución del sorteo (`/run`):**
```ts
{
  giveawayId: number;
  giveAwayDate: string;
  totalWinners: number;
  winnersByAward: Array<{
    awardId: number;
    awardName: string;
    winnersQuant: number;
    winners: Array<{
      clientId: number;
      clientCode: string;
      clientName: string;
    }>;
  }>;
}
```

**Reglas de elegibilidad de clientes:**
- `transactionDate BETWEEN trStartDate AND trEndDate`
- `amount > 300`
- Un cliente **no puede ganar dos veces** en el mismo sorteo

**Validaciones antes de ejecutar (en orden):**
1. El sorteo debe existir
2. `DateTime.Today >= giveaway.GiveawayDate` — no ejecutar antes de la fecha programada → error 409
3. No haber sido ejecutado anteriormente → error 409
4. Tener premios configurados → error 409
5. Existir clientes elegibles → error 409
6. Clientes elegibles >= total de ganadores necesarios → error 409

---

### 5. Reports (Reportes)

> Requieren JWT. Cada reporte tiene 3 formatos de salida.

#### Transacciones por fecha

| Método | Endpoint | Formato |
|---|---|---|
| GET | `/api/reports/transactions?startDate=&endDate=&page=1&pageSize=20` | JSON paginado |
| GET | `/api/reports/transactions/excel?startDate=&endDate=` | Descarga `.xlsx` |
| GET | `/api/reports/transactions/pdf?startDate=&endDate=` | Descarga `.pdf` |

**Respuesta JSON items:**
```ts
{
  transactionDate: string;
  clientCode: string;
  clientName: string;
  amount: number;
  currency: string;
  description: string;
  authNumber: string;
}
```

**Modelo de respuesta:** `PaginatedReportData<T>` — incluye `totalPages`, `hasNextPage`, `hasPreviousPage` además de los campos base.

#### Ganadores por sorteo

| Método | Endpoint | Formato |
|---|---|---|
| GET | `/api/reports/winners?giveawayDate=` | JSON (filtra por `giveawayDate` del sorteo) |
| GET | `/api/reports/winners/excel?giveawayDate=` | Descarga `.xlsx` |
| GET | `/api/reports/winners/pdf?giveawayDate=` | Descarga `.pdf` |

**Respuesta JSON items:**
```ts
{
  clientCode: string;
  clientName: string;
  awardName: string;
  giveawayDate: string;
}
```

**Nota:** Los endpoints `/excel` y `/pdf` devuelven el dataset completo sin paginación. Para descargar, usar `responseType: 'blob'` en `HttpClient` y crear un enlace de descarga dinámico.

---

## Arquitectura del proyecto Angular

```
src/app/
├── core/
│   ├── config/          # Configuración global (sidebar, etc.)
│   ├── layout/          # Layouts (default-layout, login-layout)
│   ├── models/
│   │   ├── api/         # Response<T>, Pagination<T>
│   │   ├── dtos/        # DTOs compartidos
│   │   └── entities/    # Modelos de entidad (User, etc.)
│   └── utils/           # Validadores y helpers globales
├── features/
│   ├── auth/            # Login
│   ├── awards/          # Premios — PENDIENTE
│   ├── lots/            # Lotes y transacciones — PENDIENTE
│   ├── giveaways/       # Sorteos — PENDIENTE
│   └── reports/         # Reportes — PENDIENTE
└── shared/
    ├── components/      # Componentes reutilizables (tabla, modal, badge, etc.)
    ├── directives/
    ├── pipes/
    └── pagination.service.ts
```

### Convenciones de cada feature

Cada feature sigue esta estructura interna:

```
feature-name/
├── components/          # Componentes "tontos" / presentacionales
├── models/
│   ├── dtos/
│   ├── requests/
│   └── responses/
├── pages/               # Componentes página (smart components)
├── services/
│   ├── feature-http.service.ts   # Llamadas HTTP
│   └── feature-state.service.ts  # Estado con signals
└── utils/               # Helpers del feature (mappers, etc.)
```

---

## Convenciones de código Angular

- **Signals** para el estado de los componentes y servicios (`signal()`, `computed()`, `effect()`).
- **inject()** para inyección de dependencias (no constructor DI).
- **Standalone components** siempre (`standalone: true`).
- **AsyncPipe** o suscripciones en el servicio de estado (nunca en el componente de página directamente).
- `HttpClient` inyectado en el servicio HTTP, nunca en el componente.
- Los servicios de estado (`*-state.service.ts`) exponen signals de solo lectura que los componentes consumen.
- `PaginationService` (en `shared/`) para manejar paginación; se provee a nivel de componente/página con `providers: [PaginationService]`.

### Tablas de datos

**Siempre** usar tablas HTML nativas siguiendo el patrón de `TechTableComponent` (`features/technologies/components/tech-table`). **Nunca** usar `GenericTableComponent`.

Estructura obligatoria:
- `<table class="w-full">` dentro de un `<div class="border-y border-gray-200 dark:border-neutral-800">`
- `<thead>` con cabeceras desde un array `readonly headers: string[]` en el componente
- `<tbody>` con `@for` iterando los datos
- Directiva `appTableCell` (de `@shared/directives/table-cell.directive`) en cada `<td>` con variante `variant="first"` | `"name"` | `"default"` etc.
- Filas clickeables con clase `group cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50/30 ...`
- `<lucide-icon [img]="icons.ChevronRight" class="size-4 opacity-0 group-hover:opacity-100 transition-opacity">` como última celda en tablas clickeables
- Estado vacío con `@if (items.length === 0)` inline bajo la tabla

```ts
// ✅ Correcto — tabla nativa con appTableCell
readonly headers = ['ID', 'Nombre', 'Estado', ''];

// en el template:
// <div class="border-y border-gray-200 dark:border-neutral-800">
//   <table class="w-full">...
//     <td appTableCell variant="first">{{ item.id }}</td>
```

```ts
// ❌ Incorrecto — nunca usar GenericTableComponent
// <app-generic-table [data]="items" [columnLabels]="{ ... }">
```

### app-button — uso de iconos

`ButtonComponent` ya tiene soporte nativo de iconos vía `[icon]` e `[iconPosition]`. **Nunca** pongas `<lucide-icon>` dentro de `<app-button>`.

```html
<!-- ✅ Correcto -->
<app-button [icon]="icons.Upload">Cargar</app-button>
<app-button [icon]="icons.ExternalLink" [iconPosition]="'right'">Ver todos</app-button>

<!-- ❌ Incorrecto -->
<app-button>
  <lucide-icon [img]="icons.Upload" size="16" class="mr-1" />
  Cargar
</app-button>
```

`<lucide-icon>` se usa libremente fuera de `app-button` (en zonas de drop, tablas, formularios, etc.).

### Interceptores HTTP

Todos los errores HTTP son capturados por `error.interceptor.ts` y mostrados automáticamente como toast. El token JWT se inyecta automáticamente por `auth.interceptor.ts` desde `localStorage` (`auth_token`). **No es necesario manejar errores HTTP en los servicios** más allá de retornar `false`/`null` en operaciones CRUD.

### Paginación — tamaños recomendados

- Tablas resumen (main page): `pageSize = 5`
- Páginas de listado completo: `pageSize = 5`
- Listados de reportes: `pageSize = 5`

---

## Modelo de respuesta estándar — uso en Angular

```ts
// Ejemplo de llamada HTTP
this.http.get<ApiResponse<PaginatedData<Award>>>(`${this.baseUrl}/api/awards`, { params })
  .pipe(map(res => res.data))
  .subscribe(data => {
    this.items.set(data.items);
    this.totalItems.set(data.totalCount);
  });
```

---

## Rutas Angular planeadas

```ts
// Protegidas (bajo DefaultLayoutComponent)
{ path: 'awards',                component: AwardListPageComponent }
{ path: 'lots',                  component: LotListPageComponent }
{ path: 'lots/:id/transactions', component: LotTransactionsPageComponent }
{ path: 'giveaways',             component: GiveawayListPageComponent }
{ path: 'giveaways/:id',         component: GiveawayDetailPageComponent }
{ path: 'reports/transactions',  component: ReportTransactionsPageComponent }
{ path: 'reports/winners',       component: ReportWinnersPageComponent }

// Auth (bajo LoginLayoutComponent)
{ path: 'log-in', component: LogInComponent }
```

---

## Autenticación — flujo JWT

1. POST `/api/auth/login` → recibe `{ token, expiresAt, user }`
2. Guardar token en `localStorage` o similar.  
3. Crear un `HttpInterceptor` que inyecte el header `Authorization: Bearer <token>` en todas las peticiones protegidas.
4. Si el backend devuelve 401, redirigir al login.
5. El guard de ruta verifica la existencia del token antes de activar las rutas protegidas.

---

## Descarga de archivos (Excel / PDF)

```ts
downloadFile(url: string, fileName: string): Observable<void> {
  return this.http.get(url, { responseType: 'blob' }).pipe(
    tap(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    }),
    map(() => void 0)
  );
}
```

---

## Convenciones de commits

Todos los mensajes de commit deben seguir el estándar **Conventional Commits** y estar escritos **en español**.

### Formato

```
<tipo>(<ámbito opcional>): <descripción en español>
```

### Tipos permitidos

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de errores |
| `refactor` | Cambio de código que no agrega funcionalidad ni corrige bugs |
| `style` | Cambios de formato/estilo (sin lógica) |
| `chore` | Tareas de mantenimiento, dependencias, configuración |
| `docs` | Cambios en documentación |
| `test` | Adición o modificación de pruebas |
| `perf` | Mejoras de rendimiento |
| `ci` | Cambios en configuración de CI/CD |

### Ejemplos

```
feat(awards): agregar página de listado de premios
fix(auth): corregir redirección al hacer logout
refactor(lots): extraer lógica de carga a servicio de estado
chore: actualizar dependencias de Angular
docs: añadir instrucciones de conventional commits
```

- La **descripción** debe ir en minúscula, en español y sin punto al final.
- El **ámbito** es opcional pero recomendado; usar el nombre del feature o módulo (`auth`, `awards`, `lots`, `giveaways`, `reports`, `shared`, `core`).

---

## Notas importantes del API

- En **crear premio** el campo del body es `awardname` (todo minúscula).
- En **actualizar premio** el campo del body es `awardName` (N mayúscula).
- En **crear sorteo** la fecha es `giveAwayDate` (A mayúscula), en actualizar es `giveawayDate` (a minúscula) — respetar exactamente el contrato del backend.
- El reporte de ganadores filtra por `giveawayDate` del sorteo, **no** por fecha de ejecución.
- Los clientes elegibles para un sorteo Nov-Dic 2025 (amount > 300) del seed son: C001 C002 C004 C005 C006 C007 C008 C009 C011 C012 C013 C014 C015 (13 clientes).
