# 📈 TradeLog Trading Journal Client

Frontend moderno y reactivo diseñado para la visualización profesional y el análisis de operaciones bursátiles. Este proyecto implementa una interfaz **Dark Mode Pro** con Glassmorphism, gráficos interactivos y una arquitectura optimizada para la experiencia de usuario (UX).

![React Version](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)

## 🚀 Tecnologías

* **Core:** React 18 + TypeScript.
* **Build Tool:** Vite.
* **UI Framework:** Tailwind CSS + Shadcn/ui.
* **Gráficos:** Recharts (Visualización de datos financieros).
* **Animaciones:** Framer Motion.
* **Gestión de Datos:** Axios (Cliente HTTP) + React Hooks.
* **Formularios:** React Hook Form + Zod (Validación).
* **Auth:** Supabase Auth UI & Client.

## 🏗 Arquitectura

El proyecto sigue una estructura organizada por características y capas de abstracción para facilitar la mantenibilidad:

```text
├── src
│   ├── components       # Componentes de UI reutilizables
│   │   ├── background   # Fondos animados
│   │   ├── dashboard    # Widgets (Calendario, StatsGrid)
│   │   ├── layout       # Layouts maestros (Sidebar, Navbar, Footer)
│   │   ├── trades       # Formularios y Tablas de operaciones
│   │   └── ui           # Componentes base (Shadcn: Button, Input, etc.)
│   ├── lib              # Configuración de librerías
│   │   ├── api.ts       # Cliente Axios y Servicios (Trade, User, Admin)
│   │   └── utils.ts     # Helpers de clases CSS (cn)
│   ├── pages            # Vistas principales (Rutas)
│   │   ├── admin        # Vistas de administración
│   │   ├── legal        # Términos y Privacidad
│   │   └── ...          # Dashboard, Journal, Profile, Stats
│   ├── types            # Definiciones de TypeScript (Interfaces)
│   └── App.tsx          # Router y Configuración de Rutas
```
Funcionalidades Principales

📊 Dashboard & Visualización (Analytics)
Interfaz visual potente para interpretar los datos del motor financiero del backend.

    • KPI Cards Interactivas: Visualización clara de Net Profit, Win Rate y Profit Factor con indicadores de color semántico (Profit/Loss).

    • Gráficos Avanzados: Implementación de Recharts para desgloses de Win/Loss, distribución de trades por dirección (Long/Short) y curvas de rendimiento.

    • Calendario Semanal: Componente personalizado que agrupa el PnL por semanas y días, permitiendo una visión rápida de la consistencia operativa.

📈 Trading Journal (Gestión)

    • Tabla Reactiva con Filtros: Sistema de filtrado en tiempo real (Client-side) por búsqueda de texto (Tags/Notas), Rango de Fechas, Dirección y Resultado (Win/Loss).

    • CRUD Modal: Creación y edición de trades sin salir de la página mediante Sheets laterales (Off-canvas) y validación de formularios estricta.

    • Lightbox de Evidencia: Visualización de capturas de pantalla de los trades sin abrir nuevas pestañas.

🔐 Seguridad y UX

    • Rutas Protegidas: Implementación de DashboardLayout que envuelve las rutas privadas, verificando la sesión de Supabase y redirigiendo automáticamente si el token expira.

    • Manejo de Estados: Feedback visual inmediato mediante "Toasts" (Notificaciones) para acciones de éxito o error.

     • Diseño Adaptativo: Interfaz totalmente Responsive, optimizada para escritorio y tablets con menús desplegables y navegación fluida.

🛡️ Panel de Administración (Frontend)

    • Gestión de Usuarios: Tabla interactiva para que el Administrador pueda aprobar cuentas (Whitelist), verificar usuarios o revocar accesos en tiempo real.

    •   Edición de Roles: Interfaz para modificar permisos y datos de usuarios directamente desde el cliente.

🛠️ Instalación y Configuración

    • Clonar el repositorio:

        git clone [https://github.com/GalahadDev/TradeLog-Frontend]
        cd tradelog-frontend

    • Configurar Variables de Entorno: Crea un archivo .env en la raíz del proyecto basándote en el ejemplo. Es crucial para conectar con Supabase y tu Backend.

        VITE_SUPABASE_URL=""
        VITE_SUPABASE_ANON_KEY=""
        VITE_API_URL="" 

    • Instalar Dependencias 

        npm install

    • Ejecutar el Servidor de Desarrollo

        npm run dev

## 📡 Rutas de la Aplicación

A continuación se detallan las rutas principales accesibles desde el navegador.

### 🔓 Acceso Público

| Ruta | Descripción |
| --- | --- |
| `/` | Login y Registro (Auth Page) |
| `/terms` | Términos de Servicio |
| `/privacy` | Política de Privacidad |

### 🔒 Área Privada (Requiere Sesión)

| Ruta | Descripción | Nivel de Acceso |
| --- | --- | --- |
| `/dashboard` | Panel principal con accesos rápidos y resumen | 🔵 Usuario |
| `/stats` | Métricas financieras detalladas y gráficos | 🔵 Usuario |
| `/journal` | Tabla de historial, filtros y formulario de trades | 🔵 Usuario |
| `/profile` | Edición de perfil y configuración personal | 🔵 Usuario |
| `/pending` | Pantalla de espera para cuentas no verificadas | 🟡 Pendiente |
| `/admin/users` | Panel de gestión de usuarios del sistema | 🔴 Admin |

Desarrollado para los traders disciplinados.
