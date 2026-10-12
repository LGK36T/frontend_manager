# Guía del Sistema de Estilos y Design Tokens

> **Propósito:** Especificar cómo deben declararse, leerse y aplicarse los estilos globales en Next.js con Tailwind CSS y variables CSS (`globals.css`).

---

## 1. Filosofía del Sistema de Diseño

El principio fundamental es la **centralización semántica**:
- **Nunca quemar clases de color arbitrarias** en los componentes UI (por ejemplo, evitar `bg-indigo-600`, `text-blue-500`, `border-gray-200`).
- **Todos los componentes UI consumen tokens semánticos**: `bg-primary`, `text-primary-foreground`, `border-border`, `bg-secondary`.
- El cambio de marca, tema (claro/oscuro) o rediseño corporativo se realiza en un único archivo (`src/styles/globals.css`), propagándose automáticamente por toda la aplicación.

---

## 2. Definición de Tokens en `src/styles/globals.css`

Utilizamos variables CSS con valores HSL (Hue, Saturation, Lightness) sin la función `hsl()` envolvente dentro de la variable, lo que permite que Tailwind aplique opacidades dinámicas (`bg-primary/50`).

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Fondo y texto general */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    /* Color de marca principal (Acción primaria) */
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --primary-hover: 221.2 83.2% 45%;

    /* Color secundario / Superficies alternas */
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    /* Elementos atenuados / Placeholders */
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    /* Acciones destructivas / Errores */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    /* Estructura: Bordes, Inputs y Foco */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    /* Radio de borde estándar */
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --primary-hover: 217.2 91.2% 50%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }

  /* Reset y tipografía base */
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

---

## 3. Conexión en `tailwind.config.ts`

Tailwind lee las variables CSS a través de la función `hsl(var(--token))`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 4. Reglas de Consumo en Componentes UI

### A. Para Botones e Interactivos
```tsx
// Válido (token semántico)
className="bg-primary text-primary-foreground hover:bg-primary-hover"
className="bg-secondary text-secondary-foreground hover:bg-muted"

// No recomendado (color hardcodeado)
className="bg-blue-600 text-white hover:bg-blue-700"
className="bg-gray-100 text-black hover:bg-gray-200"
```

### B. Para Bordes y Contenedores
```tsx
// Válido (token semántico)
className="border border-border bg-background rounded-lg text-foreground"

// No recomendado (color hardcodeado)
className="border border-gray-200 bg-white rounded-md text-gray-900"
```

### C. Para Inputs y Formularios
```tsx
// Válido (token semántico)
className="border border-input bg-background focus:ring-2 focus:ring-ring text-foreground"

// No recomendado (color hardcodeado)
className="border border-gray-300 bg-white focus:ring-blue-500 text-black"
```
