---
name: frontend-manager
description: >-
  Instrucciones, directrices de diseño UI/UX y estándares de componentes para agentes de IA al construir, refactorizar y optimizar aplicaciones frontend y de cliente.
---

# Skill: Frontend Manager para Agentes de IA

Este skill guía a los agentes de IA en el desarrollo frontend moderno, promoviendo componentes desacoplados, código accesible (a11y), diseño responsive mobile-first y una óptima experiencia de usuario.

---

## 🎯 Directrices Principales de Comportamiento

### 1. Arquitectura de Componentes Atómicos y Reutilizables
- **Responsabilidad Única:** Cada componente debe resolver una única función visual o lógica. Si un componente supera ~150-200 líneas, descomponerlo en subcomponentes atómicos.
- **Separación de Lógica y Presentación:** Extraer llamadas a API, transformaciones y estado complejo en custom hooks o servicios. Los componentes deben centrarse en renderizar la interfaz.

### 2. Accesibilidad (a11y) y Semántica HTML5
- Utilizar etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<article>`, `<button>`).
- Prohibir el uso de `<div>` o `<span>` con manejadores `onClick` cuando deba ser un `<button>` o `<a>`.
- Asegurar atributos accesibles: `aria-label`, `alt` descriptivo en imágenes, contraste de color adecuado y soporte de navegación por teclado.

### 3. Diseño Responsivo y Mobile-First
- Diseñar interfaces adaptables con diseño responsivo fluido y mobile-first (ej. Tailwind CSS, CSS Grid/Flexbox).
- Evitar anchos fijos en píxeles que causen desbordamiento (overflow horizontal) en pantallas pequeñas.

### 4. Manejo Defensivo de Estados
- Todo componente que consuma datos asíncronos debe contemplar y renderizar 4 estados obligatorios:
  1. **Idle / Inicial:** Estado previo a la acción.
  2. **Carga (Loading / Skeleton / Spinner):** Feedback inmediato al usuario.
  3. **Éxito (Success):** Manejo de datos poblados y estado vacío (empty state) amigable.
  4. **Error:** Mensaje claro, accionable y botón para reintentar la acción.

### 5. Optimización y Rendimiento Web
- Carga diferida (lazy loading / code splitting) para vistas y módulos pesados.
- Optimización de imágenes y activos estáticos.
- Evitar renderizados redundantes memorizando callbacks y valores computados solo cuando sea medible y necesario.

---

## 🚫 Acciones Prohibidas para el Agente

- ❌ Mutar el estado directamente en lugar de usar los disparadores de actualización.
- ❌ Omitir estados de carga o captura de errores en llamadas a APIs.
- ❌ Ignorar la experiencia de usuario en dispositivos móviles o pantallas táctiles.
- ❌ Utilizar etiquetas no semánticas para elementos interactivos primarios.
