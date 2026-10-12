# Arquitectura Técnica y Estándares Frontend

> **Versión:** 2.0 — Next.js 15+ · React 19 · TypeScript 5+ · Zustand 5 · Tailwind CSS · Axios
> **Propósito:** Documento de referencia técnica integral para desarrolladores y agentes de IA. Detalla la arquitectura por capas, decisiones de diseño, contratos de datos, sistema de tokens CSS y patrones de implementación para aplicaciones en producción.

---

## Tabla de Contenidos

1. [Visión General y Arquitectura](#1-visión-general-y-arquitectura)
2. [Creación del Proyecto](#2-creación-del-proyecto)
3. [Configuración de TypeScript](#3-configuración-de-typescript)
4. [Dependencias y Decisiones Técnicas](#4-dependencias-y-decisiones-técnicas)
5. [Variables de Entorno y Seguridad](#5-variables-de-entorno-y-seguridad)
6. [Estructura de Directorios](#6-estructura-de-directorios)
7. [Utilidades (utils)](#7-utilidades-utils)
8. [Interfaces y Tipos](#8-interfaces-y-tipos)
9. [Services](#9-services)
10. [Zustand (Store)](#10-zustand-store)
11. [Hooks](#11-hooks)
12. [Sistema de Estilos: globals.css y Tailwind](#12-sistema-de-estilos-globalscss-y-tailwind)
13. [Componentes UI](#13-componentes-ui)
14. [Componentes Layout](#14-componentes-layout)
15. [Componentes Functional](#15-componentes-functional)
16. [App y Pages en Next.js 15+](#16-app-y-pages-en-nextjs-15)
17. [Formularios y Validación](#17-formularios-y-validación)
18. [Flujo Completo de Datos](#18-flujo-completo-de-datos)
19. [Convenciones de Naming](#19-convenciones-de-naming)
20. [Docker y Despliegue](#20-docker-y-despliegue)
21. [Testing](#21-testing)
22. [Checklist Pre-Deploy y Estructura Final](#22-checklist-pre-deploy-y-estructura-final)

---

## 1. Visión General y Arquitectura

Cada aplicación frontend es un proyecto Next.js 15+ que se comunica exclusivamente con el API Gateway central (`api`), nunca de forma directa con microservicios satélites como `api-pdf` o `api-email`.

### Arquitectura Unidireccional por Capas

```
Page (Next.js 15 Server/Client)
  └── Functional Component ('use client')
        └── Custom Hook
              └── Zustand Store (Zustand 5)
                    └── Service (Axios)
                              └── API Gateway (Backend)
```

| Capa | Directorio | Responsabilidad Única |
| :--- | :--- | :--- |
| **Page** | `src/app/{feature}/page.tsx` | Punto de entrada de la ruta en Next.js App Router. Delgada; en Next.js 15 gestiona promesas asíncronas de ruta (`await params`) y monta el componente functional. |
| **Functional** | `src/components/functional/` | Componentes de dominio del negocio. Usan `'use client'`, consumen hooks y componen componentes UI. Gestionan los 4 estados de UI (loading, error, vacío, éxito). |
| **UI** | `src/components/ui/` | Componentes genéricos, puramente visuales y desacoplados. Consumen tokens semánticos definidos en `globals.css`. |
| **Layout** | `src/components/layout/` | Estructuras persistentes (`Header`, `Sidebar`, `Footer`). Consumidas exclusivamente en `src/app/layout.tsx`. |
| **Hook** | `src/store/hooks/` | Encapsula y aísla el store de Zustand con selectores atómicos. Es la única interfaz que importa el componente functional. |
| **Zustand** | `src/store/zustand/` | Única fuente de verdad del cliente. Gestiona estado global, ciclo de peticiones (`onLoading`, `onError`, `error`) y mutaciones. |
| **Service** | `src/store/services/` | Ejecución pura de peticiones HTTP con Axios tipado (`IDataResponse<T>`). No contiene estado ni lógica de negocio. |
| **Interface** | `src/store/interfaces/` | Contratos TypeScript de modelos, peticiones y respuestas. Espejo estricto del backend. |
| **Utils** | `src/utils/` | Clientes transversales configurados (`api.ts`, `config.ts`). |

---

## 2. Creación del Proyecto

Para iniciar una aplicación alineada con Next.js 15+, App Router y Turbopack:

```bash
npx create-next-app@latest app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack
cd app
```

---

## 3. Configuración de TypeScript

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 4. Dependencias y Decisiones Técnicas

### Producción
```bash
yarn add axios zustand@^5 jwt-decode sonner lucide-react react-pdf
```

### Formularios y Validación (Recomendado)
```bash
yarn add react-hook-form @hookform/resolvers zod
```

### Desarrollo
```bash
yarn add -D @types/node @types/react@^19 @types/react-dom@^19
```

### Tabla de Decisiones

| Paquete | Razón y Ventaja |
| :--- | :--- |
| `axios` | Cliente HTTP con soporte completo para interceptores, timeouts y serialización unificada. |
| `zustand` (v5) | Estado global ultraligero sin boilerplate, optimizado para React 19 y suscripciones atómicas sin re-renders fantasma. |
| `jwt-decode` | Reemplazo seguro de `jsonwebtoken` en frontend. Pesa menos de 3KB y no requiere polyfills de Node.js (`crypto`). |
| `sonner` | Notificaciones toast ligeras, totalmente accesibles y con soporte directo para Tailwind CSS. |
| `lucide-react` | Iconografía estándar, optimizada con tree-shaking para Next.js. |
| `zod` | Esquemas de validación estricta y tipado estático inferido para formularios y payloads. |

---

## 5. Variables de Entorno y Seguridad

### `.env.local`
```bash
# ─── API GATEWAY ───
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

> **REGLAS DE SEGURIDAD:**
> 1. Solo las variables requeridas en el browser llevan prefijo `NEXT_PUBLIC_`.
> 2. Claves secretas de backend o API keys privadas **NUNCA** deben llevar `NEXT_PUBLIC_`.
> 3. Mantener `.env.example` en el repositorio sin valores reales como documentación viviente.

---

## 6. Estructura de Directorios

```
src/
├── app/                           # Next.js 15 App Router
│   ├── layout.tsx                 # Layout raíz (Header, Sidebar, Toaster)
│   ├── page.tsx                   # Página de inicio / dashboard
│   ├── loading.tsx                # Skeleton de carga global
│   ├── error.tsx                  # Error boundary global
│   ├── not-found.tsx              # Página 404 personalizada
│   └── {feature}/
│       ├── page.tsx               # Entrada de la ruta (delgada)
│       └── [id]/
│           └── page.tsx           # Ruta dinámica con Promise<params>
├── components/
│   ├── functional/                # Componentes de dominio ('use client')
│   │   └── {Feature}.tsx
│   ├── layout/                    # Piezas de estructura de interfaz
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── ui/                        # Componentes UI reutilizables
│       ├── Button.tsx
│       ├── InputText.tsx
│       ├── Table.tsx
│       ├── Spinner.tsx
│       └── ErrorMessage.tsx
├── store/
│   ├── hooks/                     # Custom hooks selectores
│   │   └── use{Entity}.hook.ts
│   ├── interfaces/                # Tipos y contratos TypeScript
│   │   ├── response.interface.ts
│   │   └── {entity}.interface.ts
│   ├── services/                  # Peticiones Axios
│   │   └── {entity}.service.ts
│   └── zustand/                   # Stores globales
│       └── {entity}.store.ts
├── styles/
│   └── globals.css                # Directivas Tailwind y Tokens CSS
└── utils/
    ├── api.ts                     # Instancia e interceptores de Axios
    └── config.ts                  # Variables de entorno centralizadas
```

---

## 7. Utilidades (utils)

### `src/utils/config.ts`
Centraliza el acceso a variables de entorno para evitar `process.env` disperso:
```typescript
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
} as const
```

### `src/utils/api.ts`
Instancia única de Axios con interceptor de token JWT y control de errores:
```typescript
import axios from 'axios'
import { config } from './config'

export const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Interceptor de Request: Adjuntar JWT si existe
api.interceptors.request.use((axiosConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token && axiosConfig.headers) {
      axiosConfig.headers.Authorization = `Bearer ${token}`
    }
  }
  return axiosConfig
})

// Interceptor de Response: Manejo centralizado de 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      // Redirigir a login si es necesario
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
```

---

## 8. Interfaces y Tipos

### Interfaz Estándar de Respuesta (`src/store/interfaces/response.interface.ts`)
Toda respuesta de la API debe estar tipada usando un parámetro genérico `T`:
```typescript
export interface IDataResponse<T = unknown> {
  success: boolean
  data: T
  error?: string | null
}
```

### Interfaces de Dominio (`src/store/interfaces/user.interface.ts`)
```typescript
export interface IUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'editor'
  status: 'active' | 'inactive'
  createdAt?: string
}

export interface IUserGetAllResponse {
  data: IUser[]
  total: number
}

export interface IUserCreatePayload {
  name: string
  email: string
  role: string
}
```

---

## 9. Services

Los servicios son funciones puras que retornan promesas de Axios tipadas:
```typescript
// src/store/services/user.service.ts
import { api } from '@/utils/api'
import { IDataResponse } from '@/store/interfaces/response.interface'
import { IUser, IUserGetAllResponse, IUserCreatePayload } from '@/store/interfaces/user.interface'

export const userService = {
  getAll: () =>
    api.get<IDataResponse<IUserGetAllResponse>>('/user/getAll'),

  getById: (id: string) =>
    api.get<IDataResponse<IUser>>(`/user/getById/${id}`),

  create: (payload: IUserCreatePayload) =>
    api.post<IDataResponse<IUser>>('/user/create', payload),

  update: (id: string, payload: Partial<IUserCreatePayload>) =>
    api.put<IDataResponse<IUser>>(`/user/update/${id}`, payload),

  remove: (id: string) =>
    api.delete<IDataResponse<boolean>>(`/user/delete/${id}`),
}
```

---

## 10. Zustand (Store)

El store almacena el estado global y gestiona el ciclo de vida de peticiones (`onLoading`, `onError`, `error`):

```typescript
// src/store/zustand/user.store.ts
import { create } from 'zustand'
import { IUser, IUserCreatePayload } from '@/store/interfaces/user.interface'
import { userService } from '@/store/services/user.service'

interface UserState {
  userList: IUser[]
  total: number
  selectedUser: IUser | null
  onLoading: boolean
  onError: boolean
  error: string

  userGetAll: () => Promise<void>
  userCreate: (payload: IUserCreatePayload) => Promise<boolean>
  resetError: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  userList: [],
  total: 0,
  selectedUser: null,
  onLoading: false,
  onError: false,
  error: '',

  userGetAll: async () => {
    set({ onLoading: true, onError: false, error: '' })
    try {
      const { data: response } = await userService.getAll()
      if (!response.success) {
        throw new Error(response.error ?? 'Error desconocido al obtener usuarios')
      }
      set({
        userList: response.data.data,
        total: response.data.total,
        onLoading: false,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener usuarios'
      set({ onLoading: false, onError: true, error: message })
    }
  },

  userCreate: async (payload) => {
    set({ onLoading: true, onError: false, error: '' })
    try {
      const { data: response } = await userService.create(payload)
      if (!response.success) {
        throw new Error(response.error ?? 'Error al crear usuario')
      }
      // Revalidar lista tras creación exitosa
      await get().userGetAll()
      set({ onLoading: false })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear usuario'
      set({ onLoading: false, onError: true, error: message })
      return false
    }
  },

  resetError: () => set({ onError: false, error: '' }),
}))
```

---

## 11. Hooks

Los custom hooks aíslan el store de Zustand y proporcionan suscripciones atómicas:
```typescript
// src/store/hooks/useUser.hook.ts
import { useUserStore } from '@/store/zustand/user.store'

export const useUser = () => {
  const userGetAll   = useUserStore((s) => s.userGetAll)
  const userCreate   = useUserStore((s) => s.userCreate)
  const userList     = useUserStore((s) => s.userList)
  const total        = useUserStore((s) => s.total)
  const selectedUser = useUserStore((s) => s.selectedUser)
  const onLoading    = useUserStore((s) => s.onLoading)
  const onError      = useUserStore((s) => s.onError)
  const error        = useUserStore((s) => s.error)
  const resetError   = useUserStore((s) => s.resetError)

  return {
    userGetAll,
    userCreate,
    userList,
    total,
    selectedUser,
    onLoading,
    onError,
    error,
    resetError,
  }
}
```

---

## 12. Sistema de Estilos: globals.css y Tailwind

Todos los componentes UI deben consumir **tokens de diseño semánticos** definidos en `globals.css` y mapeados en `tailwind.config.ts`. Está estrictamente prohibido hardcodear paletas de colores arbitrarias (ej. `bg-indigo-600`) dentro de los componentes base.

### `src/styles/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    /* Colores primarios */
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --primary-hover: 221.2 83.2% 45%;

    /* Colores secundarios / superficies */
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    /* Estados */
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    /* Bordes y radio */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
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

  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

### `tailwind.config.ts`
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

## 13. Componentes UI

Componentes atómicos que consumen los tokens semánticos definidos en `globals.css`:

### `src/components/ui/Button.tsx`
```tsx
'use client'

import React from 'react'

interface ButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = '',
}) => {
  const variants = {
    primary:     'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
    secondary:   'bg-secondary text-secondary-foreground hover:bg-muted border border-border',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm',
    ghost:       'text-foreground hover:bg-secondary',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  )
}
```

### `src/components/ui/Spinner.tsx`
```tsx
import React from 'react'

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return (
    <div className="flex items-center justify-center py-6" role="status" aria-label="Cargando">
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-muted border-t-primary`} />
    </div>
  )
}
```

### `src/components/ui/ErrorMessage.tsx`
```tsx
import React from 'react'

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
    <div>
      <span className="font-semibold">Error: </span>
      {message}
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="ml-4 text-xs font-semibold underline hover:opacity-80 cursor-pointer"
      >
        Reintentar
      </button>
    )}
  </div>
)
```

---

## 14. Componentes Layout

### `src/app/layout.tsx` (RootLayout con Toaster)
```tsx
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Mi Aplicación Corporativa',
  description: 'Sistema frontend moderno construido con Next.js 15+',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6 bg-secondary/30">
              {children}
            </main>
          </div>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
```

---

## 15. Componentes Functional

Los componentes funcionales residen en `src/components/functional/`, llevan `'use client'`, consumen custom hooks y gestionan explícitamente los **4 estados de UI**:

```tsx
// src/components/functional/UserList.tsx
'use client'

import React, { useEffect } from 'react'
import { useUser } from '@/store/hooks/useUser.hook'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Table, Column } from '@/components/ui/Table'
import { IUser } from '@/store/interfaces/user.interface'

const columns: Column<IUser>[] = [
  { key: 'name',  label: 'Nombre' },
  { key: 'email', label: 'Email'  },
  { key: 'role',  label: 'Rol'    },
  {
    key: 'status',
    label: 'Estado',
    render: (value) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      }`}>
        {value === 'active' ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
]

export const UserList: React.FC = () => {
  const { userGetAll, userList, total, onLoading, onError, error } = useUser()

  useEffect(() => {
    userGetAll()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Usuarios</h1>
          {!onLoading && !onError && (
            <p className="text-sm text-muted-foreground">{total} registros encontrados</p>
          )}
        </div>
        <Button label="Recargar" onClick={userGetAll} disabled={onLoading} variant="secondary" />
      </div>

      {/* 1 & 2. Estado de Carga */}
      {onLoading && <Spinner />}

      {/* 3. Estado de Error con Reintento */}
      {onError && !onLoading && <ErrorMessage message={error} onRetry={userGetAll} />}

      {/* 4. Estado de Éxito / Datos */}
      {!onLoading && !onError && <Table data={userList} columns={columns} emptyMessage="No hay usuarios registrados" />}
    </div>
  )
}
```

---

## 16. App y Pages en Next.js 15+

Las páginas son componentes Server Components delgados. En **Next.js 15+**, los parámetros dinámicos son asíncronos (`Promise`):

### Página Estática (`src/app/users/page.tsx`)
```tsx
import { UserList } from '@/components/functional/UserList'

export default function UsersPage() {
  return <UserList />
}
```

### Página Dinámica en Next.js 15+ (`src/app/users/[id]/page.tsx`)
```tsx
import { UserDetail } from '@/components/functional/UserDetail'

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  return <UserDetail userId={id} />
}
```

---

## 17. Formularios y Validación

Patrón estándar utilizando `react-hook-form` y esquemas `zod`:

```tsx
// src/components/functional/UserForm.tsx
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useUser } from '@/store/hooks/useUser.hook'
import { Button } from '@/components/ui/Button'

const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'user', 'editor']),
})

type UserFormData = z.infer<typeof userSchema>

export const UserForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { userCreate, onLoading } = useUser()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (data: UserFormData) => {
    const success = await userCreate(data)
    if (success) {
      toast.success('Usuario creado con éxito')
      reset()
      onSuccess?.()
    } else {
      toast.error('No se pudo crear el usuario')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          {...register('name')}
          className="w-full px-3 py-2 border rounded-md border-input bg-background"
        />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded-md border-input bg-background"
        />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Rol</label>
        <select {...register('role')} className="w-full px-3 py-2 border rounded-md border-input bg-background">
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
          <option value="editor">Editor</option>
        </select>
      </div>

      <Button type="submit" label={onLoading ? 'Guardando...' : 'Crear Usuario'} disabled={onLoading} />
    </form>
  )
}
```

---

## 18. Flujo Completo de Datos

```
[Usuario Interactúa] 
       ↓
[Componente Functional] 
       ↓ (Invoca acción)
[Custom Hook] 
       ↓
[Zustand Store] ──> set({ onLoading: true })
       ↓ (Llamada HTTP)
[Axios Service] ──> API Gateway
       ↓ (Respuesta HTTP)
[Zustand Store] ──> set({ data, onLoading: false }) | set({ onError: true, error })
       ↓ (Selector atómico)
[Componente Functional] ──> Re-renderiza UI automáticamente
```

---

## 19. Convenciones de Naming

| Concepto | Convención | Ejemplo |
| :--- | :--- | :--- |
| Interfaz TypeScript | Prefijo `I` + PascalCase | `IUser`, `IDataResponse<T>` |
| Archivo de Interfaz | `{entity}.interface.ts` | `user.interface.ts` |
| Archivo de Servicio | `{entity}.service.ts` | `user.service.ts` |
| Archivo de Store | `{entity}.store.ts` | `user.store.ts` |
| Archivo de Hook | `use{Entity}.hook.ts` | `useUser.hook.ts` |
| Hook Exportado | `use{Entity}` | `useUser` |
| Store Exportado | `use{Entity}Store` | `useUserStore` |
| Componente UI | PascalCase | `Button.tsx`, `InputText.tsx` |
| Componente Functional | PascalCase descriptivo | `UserList.tsx`, `UserForm.tsx` |
| Acción en Zustand | `{entity}{Verbo}` | `userGetAll`, `userCreate` |

---

## 20. Docker y Despliegue

### `next.config.ts`
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
}

export default nextConfig
```

### Dockerfile (Multi-stage con Node 22 Alpine)
```dockerfile
# ─── Etapa 1: Dependencias ───
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ─── Etapa 2: Builder ───
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# ─── Etapa 3: Runner Producción ───
FROM node:22-alpine AS production
RUN apk add --no-cache tzdata dumb-init
ENV TZ=America/Santiago
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

---

## 21. Testing

Suite recomendada con **Vitest** y **React Testing Library**:
```bash
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Comando de verificación en `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 22. Checklist Pre-Deploy y Estructura Final

### Checklist
- [ ] Directiva `'use client'` colocada en todos los componentes interactivos y funcionales.
- [ ] Rutas dinámicas en `src/app/**/[id]/page.tsx` usan `await params` (Next.js 15+).
- [ ] Tokens de diseño centralizados en `globals.css` y mapeados en `tailwind.config.ts`.
- [ ] No existen llamadas directas a `process.env` fuera de `src/utils/config.ts`.
- [ ] Ningún secreto sensible tiene prefijo `NEXT_PUBLIC_`.
- [ ] `output: 'standalone'` activo en `next.config.ts`.
- [ ] Interfaz de respuesta usa `IDataResponse<T>` genérico.
- [ ] `yarn typecheck` pasa sin ningún error.

### Estructura de Proyecto Completa
```
app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── {feature}/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── functional/
│   │   │   ├── {Feature}List.tsx
│   │   │   └── {Feature}Form.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── InputText.tsx
│   │       ├── Table.tsx
│   │       ├── Spinner.tsx
│   │       └── ErrorMessage.tsx
│   ├── store/
│   │   ├── hooks/
│   │   │   └── use{Entity}.hook.ts
│   │   ├── interfaces/
│   │   │   ├── response.interface.ts
│   │   │   └── {entity}.interface.ts
│   │   ├── services/
│   │   │   └── {entity}.service.ts
│   │   └── zustand/
│   │       └── {entity}.store.ts
│   ├── styles/
│   │   └── globals.css
│   └── utils/
│       ├── api.ts
│       └── config.ts
├── .dockerignore
├── .env.local
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```
