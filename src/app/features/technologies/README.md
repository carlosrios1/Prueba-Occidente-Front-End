# 🖥️ Feature: Ambientes de Desarrollo (Dev Environments)

Este módulo gestiona el CRUD (Crear, Leer, Actualizar, Eliminar) de los Ambientes de Desarrollo dentro de la aplicación SGA.

## 🏗️ Arquitectura

El módulo sigue una arquitectura basada en **Servicios de Estado (State Services)** utilizando **Angular Signals** para la reactividad y separación de responsabilidades.

### Diagrama de Flujo de Datos

1. **UI Components** (`EnvListComponent`, `EnvTableComponent`) consumen señales de lectura del `EnvStateService`.
2. **User Actions** (Click, Input) invocan métodos asíncronos en el `EnvStateService`.
3. **State Service** llama al `EnvHttpService` (HTTP) para obtener o persistir datos.
4. **State Service** actualiza las señales (`signals`) internas privadas.
5. **UI Components** se actualizan automáticamente gracias a la reactividad de Signals.

---

## 🧩 Componentes Principales

### 1. `EnvListComponent` (Smart Component)
- **Ubicación**: `components/env-list/env-list.component.ts`
- **Responsabilidad**: Contenedor principal. Orquesta la inicialización de datos y la paginación.
- **Interacción**: Inyecta `EnvStateService` para coordinar la vista y delegar la lógica de negocio.

### 2. `EnvTableComponent` (Presentation Component)
- **Ubicación**: `components/env-list/components/env-table/env-table.component.ts`
- **Responsabilidad**: Renderizar la tabla de datos.
- **Características**:
  - Maneja estados visuales de carga (`isLoading`), error y lista vacía (`isEmpty`).
  - Gestiona la apertura de modales de edición y eliminación mediante señales locales.
  - Utiliza `TableCellDirective` y `BadgeVariantPipe` para estilos consistentes.

### 3. `EnvFormComponent` (Modal/Form)
- **Ubicación**: `components/env-form/env-form.component.ts`
- **Responsabilidad**: Formulario reactivo para crear o editar ambientes.
- **Características**:
  - Usa `ReactiveFormsModule` con validaciones tipadas.
  - Maneja el estado de envío (`isSubmitting`) y cierre automático tras éxito.

### 4. `AppFiltersComponent`
- **Ubicación**: `components/os-list/components/filters/filters.component.ts`
- **Responsabilidad**: Barra de búsqueda y filtros.
- **Lógica**: Implementa un *debounce* de 300ms antes de invocar `setFilters` en el servicio de estado para evitar llamadas excesivas.

---

## ⚡ Gestión de Estado (`EnvStateService`)

Este servicio actúa como la única fuente de verdad para el módulo. No expone el estado mutable directamente, sino `computed signals` de solo lectura.

**Ubicación**: `services/env-state.service.ts`

### Estado Reactivo (Signals Públicas)
| Signal            | Tipo                                 | Descripción                                             |
| ----------------- | ------------------------------------ | ------------------------------------------------------- |
| `devEnvironments` | `Signal<DevEnvironmentSummaryDto[]>` | Lista actual de ambientes mostrados.                    |
| `isLoading`       | `Signal<boolean>`                    | Indica carga inicial o bloqueo total.                   |
| `isPaginating`    | `Signal<boolean>`                    | Indica carga de fondo al cambiar de página.             |
| `isFiltering`     | `Signal<boolean>`                    | Indica carga al aplicar filtros de búsqueda.            |
| `totalElements`   | `Signal<number>`                     | Total de registros en BD (usado para calcular páginas). |
| `filters`         | `Signal<Object>`                     | Objeto con los filtros activos actuales.                |

### Acciones (Métodos Públicos)
- **`loadDevEnvironments(type)`**: Carga datos según el contexto ('initial', 'paginate', 'filter') gestionando los flags de carga correspondientes.
- **`setFilters(filters)`**: Actualiza el estado de filtros y reinicia la paginación a la página 1.
- **`goToPage(page)`**: Cambia la página actual y recarga los datos.

> **Nota:** Algunos métodos de escritura (`create`, `update`, `delete`) pueden conservar nombres heredados del módulo base (ej. `createOperatingSystem`) pendiente de refactorización, pero operan sobre la entidad de Ambientes.

---

## 🌐 Capa de Datos (`EnvHttpService`)

Encargada de la comunicación HTTP pura. Actualmente implementa un modo de simulación (mock) y código comentado para producción.

**Ubicación**: `services/env-http.service.ts`

- **Métodos**: `getAllDevEnvironments`, `createOs` (alias), `updateOs` (alias), `deleteOs` (alias).
- **Mocking**: Utiliza un array en memoria `mockOsList` y `RxJS delay` (500ms) para simular latencia de red y comportamiento asíncrono.

---

## 🚀 Guía de Extensión

### Agregar un nuevo filtro
1. Modificar `GetAllDevEnvironmentsRequest` para incluir el nuevo campo.
2. Actualizar la interfaz `DevEnvironmentState` en el servicio de estado.
3. Agregar el input correspondiente en `AppFiltersComponent`.
4. En el evento de cambio del input, llamar a `envState.setFilters({ nuevoCampo: valor })`.
5. Actualizar `EnvHttpService` para enviar el parámetro al backend.