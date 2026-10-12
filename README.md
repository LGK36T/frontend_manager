# Frontend Manager

Skill de desarrollo frontend para agentes de IA y desarrolladores. Define estándares de arquitectura por capas, convenciones de código y plantillas para aplicaciones basadas en Next.js 15+, React 19, TypeScript, Zustand 5, Axios y Tailwind CSS.

---

## Arquitectura y Principios

- **Separación por capas:** Flujo unidireccional `Page` -> `Functional Component` -> `Hook` -> `Zustand Store` -> `Service` -> `API Gateway`.
- **Next.js 15+ y React 19:** Parámetros de ruta asíncronos (`await params`), delimitación clara de Server y Client Components (`'use client'`), y estado global con Zustand 5.
- **Tokens de diseño:** Consumo de variables semánticas desde `globals.css` en lugar de clases de color arbitrarias.
- **Manejo de estados de UI:** Gestión explícita de carga, error con reintento, éxito y estados vacíos.
- **Seguridad:** Variables de entorno centralizadas y decodificación de tokens en cliente con `jwt-decode`.

---

## Estructura del Repositorio

```text
frontend_manager/
├── SKILL.md                          # Instrucciones y flujo de trabajo principal
├── references/                       # Documentación técnica de referencia
│   ├── technical-architecture.md     # Especificación técnica detallada
│   └── globals-and-styling.md        # Tokens CSS, globals.css y Tailwind
├── resources/
│   └── templates/                    # Plantillas de código reutilizables
│       ├── store.template.ts         # Store de Zustand
│       ├── service.template.ts       # Servicio HTTP con Axios
│       ├── hook.template.ts          # Custom Hook selector
│       ├── functional.template.tsx   # Componente funcional
│       └── page.template.tsx         # Página de App Router
├── CHANGELOG.md                      # Historial de cambios
├── LICENSE                           # Licencia MIT
└── README.md                         # Este documento
```

---

## Instalación y Uso

Colocar este directorio dentro de la ruta de skills del entorno de trabajo:

```bash
.agents/skills/frontend_manager/
```

Para consultar el flujo de trabajo completo, ver [SKILL.md](./SKILL.md).

---

## Licencia

[MIT](./LICENSE)
