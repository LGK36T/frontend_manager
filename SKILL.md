---
name: frontend-manager
description: >-
  Instrucciones y estándares para construir y mantener aplicaciones frontend en Next.js 15+, React 19, TypeScript, Tailwind CSS, Zustand y Axios.
---

# Frontend Manager

Guía de arquitectura y flujo de desarrollo para aplicaciones frontend en Next.js 15+, React 19, Zustand 5, Axios y Tailwind CSS.

---

## Arquitectura por Capas

El flujo de datos es estrictamente unidireccional:

```
Page (Next.js 15) -> Functional Component ('use client') -> Hook -> Zustand Store -> Service (Axios) -> API Gateway
```

Documentación detallada en [Guía de Arquitectura Técnica](./references/technical-architecture.md).

---

## Flujo de Trabajo

Al implementar o modificar un módulo (feature), seguir este orden:

### 1. Definir Interfaces
- Ubicación: `src/store/interfaces/{feature}.interface.ts`.
- Mantener paridad con los contratos del backend.
- Utilizar `IDataResponse<T>` desde `src/store/interfaces/response.interface.ts`.

### 2. Implementar Servicio HTTP
- Ubicación: `src/store/services/{feature}.service.ts`.
- Usar la instancia compartida `api` de `@/utils/api`.
- Funciones puras sin estado:
  ```typescript
  export const entityService = {
    getAll: () => api.get<IDataResponse<IEntityGetAllResponse>>('/entity/getAll'),
  }
  ```
- Referencia: [service.template.ts](./resources/templates/service.template.ts).

### 3. Crear Store de Zustand
- Ubicación: `src/store/zustand/{feature}.store.ts`.
- Gestionar obligatoriamente el ciclo de vida:
  - `onLoading: boolean` (`false` por defecto).
  - `onError: boolean` (`false` por defecto).
  - `error: string` (`''` por defecto).
- Ciclo de acción asíncrona:
  1. `set({ onLoading: true, onError: false, error: '' })`.
  2. Ejecutar servicio y validar `if (!response.data.success) throw new Error(...)`.
  3. Guardar datos: `set({ data, onLoading: false })`.
  4. Capturar errores: `set({ onLoading: false, onError: true, error: message })`.
- Referencia: [store.template.ts](./resources/templates/store.template.ts).

### 4. Encapsular en Custom Hook
- Ubicación: `src/store/hooks/use{Feature}.hook.ts`.
- Los componentes consumen este hook, nunca el store directamente.
- Usar selectores atómicos (`s => s.field`) para evitar re-renderizados innecesarios.
- Referencia: [hook.template.ts](./resources/templates/hook.template.ts).

### 5. Desarrollar Componente Functional
- Ubicación: `src/components/functional/{Feature}.tsx`.
- Incluir `'use client'` en la primera línea.
- Manejar los 4 estados de interfaz:
  1. Inicial.
  2. Carga (`onLoading`): `<Spinner />` o Skeleton.
  3. Error (`onError`): `<ErrorMessage message={error} onRetry={...} />`.
  4. Éxito: datos o estado vacío (`emptyMessage`).
- Referencia: [functional.template.tsx](./resources/templates/functional.template.tsx).

### 6. Crear Página en App Router
- Ubicación: `src/app/{feature}/page.tsx`.
- Mantener la página delgada, delegando el renderizado al componente functional.
- En rutas dinámicas de Next.js 15 (`[id]/page.tsx`), resolver `params` de forma asíncrona:
  ```typescript
  interface PageProps {
    params: Promise<{ id: string }>
  }
  export default async function Page({ params }: PageProps) {
    const { id } = await params
    return <FeatureDetail id={id} />
  }
  ```
- Referencia: [page.template.tsx](./resources/templates/page.template.tsx).

### 7. Aplicar Estilos desde Tokens
- No usar colores arbitrarios (`bg-indigo-600`, `text-blue-500`).
- Usar tokens semánticos de `globals.css` y `tailwind.config.ts`:
  - Primario: `bg-primary text-primary-foreground hover:bg-primary-hover`
  - Secundario: `bg-secondary text-secondary-foreground hover:bg-muted`
  - Errores: `bg-destructive text-destructive-foreground`
  - Superficies: `border-border`, `bg-background`, `text-foreground`
- Referencia: [Guía de Estilos y Tokens](./references/globals-and-styling.md).

### 8. Verificación
```bash
yarn typecheck || npx tsc --noEmit
yarn lint
```

---

## Reglas Estrictas

- Incluir `'use client'` en cualquier componente que use hooks o maneje eventos de usuario.
- Tratar `params` y `searchParams` como promesas en páginas y layouts de Next.js 15.
- No importar `jsonwebtoken` en código de cliente; usar `jwt-decode`.
- No acceder a `process.env` fuera de `src/utils/config.ts`.
- No usar colores fijos en componentes UI; consumir variables semánticas.
- No importar el store de Zustand directamente en páginas o componentes; usar siempre el hook correspondiente.
- No colocar lógica de negocio ni JSX complejo en `src/app/**/page.tsx`.

---

## Referencias y Plantillas

- [Guía de Arquitectura Técnica](./references/technical-architecture.md)
- [Sistema de Estilos y Tokens](./references/globals-and-styling.md)
- [Plantillas de Código](./resources/templates/)
