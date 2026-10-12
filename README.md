# Frontend Manager (AI Agent Skill)

Skill especializada para guiar a los agentes de Inteligencia Artificial al diseñar, codificar, refactorizar y verificar aplicaciones frontend, componentes de interfaz y experiencia de usuario (UI/UX).

---

## 📌 ¿Qué es este Skill?

**Frontend Manager** provee un conjunto riguroso de directrices para que los agentes de IA (como Antigravity, Claude Code, Cursor, Copilot, etc.) construyan interfaces de usuario accesibles, responsivas, modulares y optimizadas para producción.

La especificación completa del comportamiento del agente se encuentra en [SKILL.md](file:///home/LGK36T/workspace/skills/frontend_manager/SKILL.md).

---

## 🎯 Directrices que impone a la IA

- **Componentes Atómicos:** Responsabilidad única, reutilización y desacoplamiento de la lógica en custom hooks.
- **Accesibilidad Obligatoria (a11y):** HTML5 semántico, compatibilidad con lectores de pantalla y navegación completa por teclado.
- **Diseño Mobile-First:** Enfoque prioritario en dispositivos móviles y layouts fluidos sin desbordamientos horizontales.
- **Estados de Interfaz Defensivos:** Renderizado explícito de estados inicial, carga (skeletons), éxito y error con reintento.
- **Rendimiento Cliente:** Code-splitting por ruta, optimización de assets y prevención de renderizados innecesarios.

---

## 📂 Contenido del Repositorio

```text
frontend_manager/
├── SKILL.md             # Instrucciones principales para el agente de IA
├── CHANGELOG.md         # Historial de cambios del skill
├── LICENSE              # Licencia de código abierto (MIT)
├── README.md            # Documentación y descripción del skill
└── .gitignore           # Exclusiones de control de versiones
```

---

## 🚀 Uso e Integración

### En Google Antigravity / Asistentes IA
Coloca este repositorio dentro del directorio de skills de tu espacio de trabajo:
```bash
.agents/skills/frontend_manager/
# o ~/.gemini/antigravity-cli/skills/frontend_manager/
```
El agente descubrirá automáticamente el archivo `SKILL.md` y aplicará estas directrices cuando trabaje con vistas, componentes y estilos frontend.

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](file:///home/LGK36T/workspace/skills/frontend_manager/LICENSE).
