# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [0.3.0] - 2026-10-12

### Añadido
- Actualización tecnológica mayor a **Next.js 15+** y **React 19** con soporte para Async Request APIs (`await params`).
- Documento de referencia técnica integral de 22 secciones en [`references/technical-architecture.md`](./references/technical-architecture.md).
- Especificación dedicada del sistema de estilos, tokens CSS y Tailwind en [`references/globals-and-styling.md`](./references/globals-and-styling.md).
- Plantillas de producción para agentes de IA en `resources/templates/`:
  - `store.template.ts` (Zustand 5 con manejo completo de ciclo de vida).
  - `service.template.ts` (Axios tipado con genérico `IDataResponse<T>`).
  - `hook.template.ts` (Custom hook selector atómico).
  - `functional.template.tsx` (Componente con `'use client'` y 4 estados de UI).
  - `page.template.tsx` (Página delgada en Next.js 15 App Router).

### Modificado
- Reescritura completa de [`SKILL.md`](./SKILL.md) como Runbook procedimental ejecutable con 8 pasos guiados y directrices estrictas para agentes de IA.
- Actualización de [`README.md`](./README.md) con la nueva arquitectura modular y principios de Progressive Disclosure.
- Reemplazo de `jsonwebtoken` por `jwt-decode` para compatibilidad completa en browser y Turbopack.
- Integración de sistema de notificaciones con `sonner`.

---

## [0.2.0] - 2026-10-11

### Añadido
- Archivo nativo para agentes de IA ([SKILL.md](file:///home/LGK36T/workspace/skills/frontend_manager/SKILL.md)) con directrices de arquitectura de componentes atómicos, accesibilidad (a11y), mobile-first y manejo defensivo de estados.
- Licencia de código abierto MIT ([LICENSE](file:///home/LGK36T/workspace/skills/frontend_manager/LICENSE)).

### Modificado
- Reorientación completa del proyecto de módulo genérico a **Skill para agentes de IA** en [README.md](file:///home/LGK36T/workspace/skills/frontend_manager/README.md).

---

## [0.1.0] - 2026-10-11

### Añadido
- Inicialización del repositorio Git y configuración base del proyecto.
- Documentación inicial y registro de control de cambios.
- Configuración de exclusiones de archivos para control de versiones (`.gitignore`).
