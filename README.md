# DevTree — Frontend

Una interfaz moderna y rápida para gestionar tu perfil y árbol de enlaces. Construida con React + Vite, Tailwind CSS y TanStack Query, enfocada en una gran experiencia de desarrollo y rendimiento en producción.

## Características

- Perfil editable: handle, descripción e imagen de perfil.
- Árbol de enlaces sociales con íconos y estados habilitado/deshabilitado.
- Autenticación con token: inyección automática en peticiones (Authorization: Bearer).
- Subida de imágenes con feedback (toasts con Sonner).
- Caché y refetch inteligentes con TanStack Query.
- Enrutamiento con React Router y layouts para áreas públicas/privadas.

## Stack Tecnológico

- React 19 + Vite 7 (plugin react-swc)
- TypeScript 5
- Tailwind CSS 4 + @tailwindcss/vite
- TanStack React Query 5
- React Hook Form
- Axios + interceptores
- Sonner (notificaciones)

## Requisitos

- Node.js >= 18
- npm, pnpm o yarn (cualquiera)
- Backend operativo y accesible (ver variable VITE_BACKEND_URL)

## Inicio Rápido

```bash
# 1) Instalar dependencias
cd Frontend
npm install

# 2) Configurar variables de entorno
# Crea .env en la carpeta Frontend y apunta al backend

# 3) Levantar entorno de desarrollo
npm run dev

# 4) Lint (opcional)
npm run lint
```

## Variables de Entorno

Crea un archivo `.env` en `Frontend/` con:

```env
VITE_BACKEND_URL=http://localhost:4000
```

- `VITE_BACKEND_URL`: URL base del backend. Se usa en `src/config/axios.ts`.
- El token de sesión se guarda en `localStorage` bajo la clave `AUTH_TOKEN` y se añade automáticamente a cada request.

## Scripts

- `dev`: arranca el servidor de desarrollo de Vite.
- `build`: compila TypeScript y genera el build de producción.
- `preview`: sirve el build para verificación local.
- `lint`: ejecuta ESLint.

## Estructura de Carpetas (resumen)

- `src/`
  - `views/`: pantallas principales (Login, Register, Profile, LinkTree).
  - `layouts/`: AppLayout (área autenticada) y AuthLayout.
  - `components/`: UI reutilizable, DevTree, inputs, tabs, etc.
  - `api/`: cliente de API (DevTreeApi.ts).
  - `config/`: configuración de Axios y alias.
  - `types/`: tipos User, ProfileUpdate, etc.
  - `utils/`: utilidades.
- `public/SocialIcons/`: íconos y componente Icon.
- `vite.config.ts`: configuración de Vite con alias @ → src.

## Flujo de Datos Clave

- Obtención del usuario:
  - AppLayout ejecuta useQuery({ queryKey: ["getUser"], queryFn: getUser }).
  - Renderiza DevTree con `data` del usuario.
- Actualización de perfil:
  - ProfileView envía cambios vía updateUserMutation.
  - En onSuccess, el caché se actualiza con queryClient.setQueryData(["getUser"], data.user) para refrescar la vista al instante.
- Subida de imagen:
  - uploadImageMutation actualiza `image` en el caché de `getUser` para un update inmediato.

## Integración con Backend

- Endpoints usados (referencia):
  - GET /user → datos del perfil.
  - PATCH /user → actualización de perfil.
  - POST /user/image → subida de imagen.
- El Authorization se añade desde el interceptor en `src/config/axios.ts` si `AUTH_TOKEN` existe en `localStorage`.

## Estilos y UI

- Tailwind CSS 4 para estilos utilitarios.
- Íconos en `public/SocialIcons` con `IconName` tipado.
- Sonner para toasts (Toaster ya configurado en DevTree).

## Calidad y Mantenimiento

- ESLint con reglas para React, hooks y TypeScript.
- Alias `@` para imports limpios.
- Tipado consistente usando los modelos de `src/types`.

## Build y Deploy

```bash
# Construir producción
npm run build

# Previsualizar build
npm run preview
```

- Sirve el contenido generado por Vite en cualquier hosting estático.
- Recuerda configurar `VITE_BACKEND_URL` en el entorno del hosting.

## Resolución de Problemas

- La vista no actualiza el handle tras guardar:
  - Verifica que ProfileView usa `queryClient.setQueryData(["getUser"], data.user)` en `onSuccess`.
  - Asegura que AppLayout consume `getUser` y renderiza `<DevTree data={data} />`.
- Errores de CORS o 401:
  - Revisa `VITE_BACKEND_URL` y el token en `localStorage`.
- Alias `@` no resuelve:
  - Confirma `vite.config.ts` y que ejecutas scripts desde la carpeta Frontend.

## Roadmap (ideas)

- Edición y orden drag & drop de enlaces.
- Temas (dark/light) y personalización avanzada.
- Preview pública del perfil con URL compartible.

---

Hecho con ❤️ para desarrolladores que valoran velocidad y simplicidad.
