# Frontend Manager (AI Agent Skill)

Skill de alto rendimiento para guiar a los agentes de Inteligencia Artificial (como Google Antigravity) al diseñar, codificar, estructurar, refactorizar y verificar aplicaciones frontend basadas en **Next.js 15+**, **React 19**, **TypeScript**, **Zustand 5**, **Tailwind CSS** y **Axios**.

---

## 📌 ¿Qué es este Skill?

**Frontend Manager** provee un conjunto riguroso de directrices operativas (Runbook) y una arquitectura técnica por capas estricta para que los agentes de IA construyan interfaces de usuario accesibles, responsivas, modulares y optimizadas para producción.

La especificación procedimental completa para el agente se encuentra en [SKILL.md](file:///home/LGK36T/workspace/skills/frontend_manager/SKILL.md).

---

## 🎯 Directrices que impone a la IA

- **Arquitectura Unidireccional por Capas:** Separación rígida: `Page` ➔ `Functional Component` ➔ `Custom Hook` ➔ `Zustand Store` ➔ `Axios Service` ➔ `API Gateway`.
- **Compatibilidad Next.js 15+ y React 19:** Manejo asíncrono obligatorio de parámetros de ruta (`await params`), uso defensivo de la directiva `'use client'` y estado global optimizado con Zustand v5.
- **Sistema de Tokens Semánticos (`globals.css`):** Prohibición de hardcodear clases de colores fijas (`bg-indigo-600`); consumo obligatorio de tokens (`bg-primary`, `text-primary-foreground`, `border-border`).
- **Manejo Defensivo de 4 Estados de UI:** Todo componente asíncrono debe gestionar y renderizar: Idle, Carga (`onLoading`), Error con reintento (`onError`) y Éxito/Vacío (`emptyMessage`).
- **Seguridad y Validación:** Acceso centralizado a variables de entorno sin exponer secretos, validación con `zod` y decodificación de tokens con `jwt-decode`.

---

## 📂 Contenido del Repositorio

```text
frontend_manager/
├── SKILL.md                          # Instrucciones y Runbook para el agente de IA
├── references/                       # Documentación técnica profunda (Progressive Disclosure)
│   ├── technical-architecture.md     # Guía técnica integral de 22 secciones (Next.js 15+, Docker, etc.)
│   └── globals-and-styling.md        # Especificación de tokens CSS, globals.css y Tailwind
├── resources/
│   └── templates/                    # Plantillas de código listas para producción
│       ├── store.template.ts         # Store de Zustand con ciclo de vida completo
│       ├── service.template.ts       # Servicio Axios tipado con IDataResponse<T>
│       ├── hook.template.ts          # Custom Hook selector para aislamiento
│       ├── functional.template.tsx   # Componente funcional con 'use client' y 4 estados
│       └── page.template.tsx         # Página delgada en App Router (Next.js 15)
├── CHANGELOG.md                      # Historial de versiones del skill
├── LICENSE                           # Licencia de código abierto (MIT)
├── README.md                         # Descripción general del repositorio
└── .gitignore                        # Exclusiones de control de versiones
```

---

## 🚀 Uso e Integración

### En Google Antigravity / Asistentes IA
Coloca este repositorio dentro del directorio de skills de tu espacio de trabajo:
```bash
.agents/skills/frontend_manager/
# o ~/.gemini/antigravity-cli/skills/frontend_manager/
```

El agente descubrirá automáticamente el archivo [SKILL.md](file:///home/LGK36T/workspace/skills/frontend_manager/SKILL.md) y activará este skill cuando se requiera crear o modificar aplicaciones frontend, componentes o pantallas.

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](file:///home/LGK36T/workspace/skills/frontend_manager/LICENSE).
