# Luxe Estate 🏡

Luxe Estate es una plataforma moderna para el descubrimiento y gestión de propiedades inmobiliarias de lujo, construida con las últimas tecnologías web.

## 🚀 Tecnologías Principales

- **[Next.js](https://nextjs.org/)** - App Router y Server Actions
- **[Supabase](https://supabase.com/)** - Autenticación, Base de Datos PostgreSQL, Storage y RLS
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilos responsivos
- **i18n** - Soporte multi-idioma (Inglés, Español, Francés)

## ✨ Características Destacadas

- **Dashboard de Administración:** Gestión de usuarios (Roles: Admin, Agent, User) y propiedades.
- **Internacionalización (i18n):** Sistema de idiomas con diccionarios.
- **Visualización en Mapa:** Integración de mapas para ubicar propiedades.
- **Autenticación e Identidad:** Seguridad a través de Supabase Auth.
- **Subida de Imágenes:** Bucket de imágenes para detalles de propiedades.

## 🛠️ Configuración y Desarrollo

### Prerrequisitos
- Node.js (v18+)
- Cuenta y base de datos en Supabase

### Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno. Crea un archivo `.env.local` y añade tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

3. Aplica las migraciones de Base de Datos ubicadas en `supabase/migrations/` para inicializar el esquema de RBAC y propiedades.

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la página principal.
