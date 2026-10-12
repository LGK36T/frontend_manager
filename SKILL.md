---
name: frontend-manager
description: >-
  Instrucciones, directrices de arquitectura y procedimientos paso a paso para agentes de IA al crear, refactorizar, estructurar y optimizar aplicaciones frontend basadas en Next.js 15+, React 19, TypeScript, Tailwind CSS, Zustand y Axios.
---

# Skill: Frontend Manager para Agentes de IA

Este skill guía al agente de IA en la construcción y mantenimiento de aplicaciones frontend modernas bajo una estricta arquitectura por capas. Garantiza que todo código producido sea escalable, testeable, accesible y compatible con **Next.js 15+** y **React 19**.

---

## 🏗️ Arquitectura por Capas Estricta

Toda funcionalidad (feature) debe respetar el flujo unidireccional de datos:

```
Page (Next.js 15) ──> Functional Component ('use client') ──> Hook ──> Zustand Store ──> Service (Axios) ──> API Gateway
```

Para consultar las decisiones técnicas completas y diagramas en detalle, revisa la [Guía de Arquitectura Técnica](./references/technical-architecture.md).

---

## 📋 Flujo de Trabajo Paso a Paso (Runbook para la IA)

Cuando se te solicite crear o extender un feature (ejemplo: `user`, `product`, `invoice`), ejecuta estrictamente los siguientes pasos en orden:

### Paso 1: Definir Interfaces y Contratos
- Ubicación: `src/store/interfaces/{feature}.interface.ts`.
- Asegura sincronización con los contratos del backend.
- Extiende siempre con la interfaz genérica `IDataResponse<T>` desde `src/store/interfaces/response.interface.ts`.

### Paso 2: Implementar el Servicio HTTP
- Ubicación: `src/store/services/{feature}.service.ts`.
- Usa exclusivamente la instancia compartida `api` desde `@/utils/api`.
- Mantén el servicio como funciones puras sin estado:
  ```typescript
  export const entityService = {
    getAll: () => api.get<IDataResponse<IEntityGetAllResponse>>('/entity/getAll'),
  }
  ```
- *Plantilla de referencia:* [service.template.ts](./resources/templates/service.template.ts)

### Paso 3: Crear el Store de Zustand 5
- Ubicación: `src/store/zustand/{feature}.store.ts`.
- Cada store debe implementar obligatoriamente el ciclo de vida de peticiones:
  - `onLoading: boolean` (inicializado en `false`).
  - `onError: boolean` (inicializado en `false`).
  - `error: string` (inicializado en `''`).
- Cada acción asíncrona debe:
  1. Activar `set({ onLoading: true, onError: false, error: '' })`.
  2. Llamar al servicio y validar `if (!response.data.success) throw new Error(...)`.
  3. Guardar datos y apagar carga: `set({ data, onLoading: false })`.
  4. Capturar errores y activar: `set({ onLoading: false, onError: true, error: message })`.
- *Plantilla de referencia:* [store.template.ts](./resources/templates/store.template.ts)

### Paso 4: Encapsular en un Custom Hook
- Ubicación: `src/store/hooks/use{Feature}.hook.ts`.
- Los componentes nunca importan el store directamente. Importan este hook.
- Implementa selectores atómicos independientes (`s => s.field`) para prevenir re-renderizados innecesarios.
- *Plantilla de referencia:* [hook.template.ts](./resources/templates/hook.template.ts)

### Paso 5: Desarrollar el Componente Functional
- Ubicación: `src/components/functional/{Feature}.tsx`.
- **Obligatorio:** Incluir `'use client'` en la primera línea.
- Debe contemplar y renderizar explícitamente los **4 estados de UI**:
  1. **Idle / Inicial.**
  2. **Carga (`onLoading`):** Mostrar `<Spinner />` o Skeleton.
  3. **Error (`onError`):** Mostrar `<ErrorMessage message={error} onRetry={...} />`.
  4. **Éxito / Datos:** Renderizar datos poblados o mensaje amigable si la lista está vacía (`emptyMessage`).
- *Plantilla de referencia:* [functional.template.tsx](./resources/templates/functional.template.tsx)

### Paso 6: Crear la Página en Next.js 15 App Router
- Ubicación: `src/app/{feature}/page.tsx`.
- Las páginas deben ser delgadas y solo montar el componente functional.
- **En Next.js 15+**, si la ruta tiene parámetros dinámicos (`[id]/page.tsx`):
  ```typescript
  interface PageProps {
    params: Promise<{ id: string }>
  }
  export default async function Page({ params }: PageProps) {
    const { id } = await params
    return <FeatureDetail id={id} />
  }
  ```
- *Plantilla de referencia:* [page.template.tsx](./resources/templates/page.template.tsx)

### Paso 7: Aplicar Estilos desde `globals.css` y Tailwind
- **Regla Estricta:** No utilices clases de colores arbitrarios hardcodeados (`bg-indigo-600`, `text-blue-500`).
- Consume los tokens semánticos definidos en `globals.css` y `tailwind.config.ts`:
  - Acciones primarias: `bg-primary text-primary-foreground hover:bg-primary-hover`
  - Acciones secundarias: `bg-secondary text-secondary-foreground hover:bg-muted`
  - Errores / Alertas: `bg-destructive text-destructive-foreground`
  - Bordes y Superficies: `border-border`, `bg-background`, `text-foreground`
- Para detalles de los tokens, consulta la [Guía de Estilos y Tokens](./references/globals-and-styling.md).

### Paso 8: Validación de Calidad
Antes de concluir una tarea, verifica:
```bash
# Verificar tipos de TypeScript sin emitir código
yarn typecheck || npx tsc --noEmit

# Validar linting
yarn lint
```

---

## 🚫 Acciones Prohibidas para el Agente

- ❌ **Omitir `'use client'`** en componentes que consuman hooks (`useUser`, `useEffect`, `useState`) o manejen eventos (`onClick`).
- ❌ **Acceder a `params` o `searchParams` de forma síncrona** en Next.js 15+ sin resolver la `Promise`.
- ❌ **Importar `jsonwebtoken` en el browser** (usar exclusivamente `jwt-decode`).
- ❌ **Acceder directamente a `process.env`** fuera de `src/utils/config.ts`.
- ❌ **Hardcodear colores hexadecimales o clases Tailwind fijas** en componentes UI en lugar de usar los tokens semánticos de `globals.css`.
- ❌ **Importar el store de Zustand directamente en las Pages o Componentes Funcionales** (siempre a través del custom hook).
- ❌ **Colocar lógica de negocio o JSX complejo dentro de `src/app/**/page.tsx`** (la página solo debe montar el componente functional).

---

## 📚 Recursos y Referencias Adicionales

- 📖 [Guía de Arquitectura Técnica Completa](./references/technical-architecture.md)
- 🎨 [Guía del Sistema de Estilos y Tokens](./references/globals-and-styling.md)
- 📦 [Plantillas de Código](./resources/templates/)
