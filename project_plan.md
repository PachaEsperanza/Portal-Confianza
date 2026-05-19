# Portal de Proveedores

## 1. Descripción del Proyecto
Plataforma SaaS privada para proveedores donde pueden acceder a su información de manera segura. Cada proveedor ve únicamente sus propios datos (productos, órdenes, lotes, pagos, contrato). Diseñado para diferentes tipos de proveedores (café, cacao, etc.) con aislamiento total de datos entre ellos.

## 2. Estructura de Páginas
- `/` - Home: Hero minimalista con "Bienvenidos Proveedores" y botón "Acceder al Portal"
- `/auth` - Autenticación: Login y registro de primer acceso por código de proveedor
- `/dashboard` - Panel privado del proveedor (protegido por autenticación)
  - `/dashboard/products` - Mis Productos
  - `/dashboard/orders` - Órdenes y Solicitudes
  - `/dashboard/new-lot` - Nuevo Lote
  - `/dashboard/my-lots` - Mis Lotes
  - `/dashboard/payments` - Estado de Pagos
  - `/dashboard/contract` - Mi Contrato
  - `/dashboard/profile` - Configuración de Perfil

## 3. Características Principales
- [ ] Página de inicio minimalista con Hero
- [ ] Sistema de autenticación (login + registro por código)
- [ ] Validación de código de proveedor en primer acceso
- [ ] Creación de contraseña en primer acceso
- [ ] Dashboard con métricas resumen
- [ ] Sección Mis Productos (lista filtrada por supplier_id)
- [ ] Sección Órdenes y Solicitudes (tabla filtrada)
- [ ] Sección Nuevo Lote (formulario con tipo, región, peso, proceso, empaque, fecha, fotos)
- [ ] Sección Mis Lotes (lista de lotes registrados)
- [ ] Sección Estado de Pagos (tabla con montos, porcentajes, banco, estado)
- [ ] Sección Mi Contrato (visualización de contrato)
- [ ] Configuración de perfil (cambiar contraseña, ver código)
- [ ] Aislamiento total de datos entre proveedores
- [ ] Logout con limpieza de sesión
- [ ] Diseño responsive

## 4. Modelo de Datos (Mock/localStorage)
### Proveedores
| Campo | Tipo | Descripción |
|-------|------|-------------|
| supplier_id | string | Código único (SUP-001, SUP-002) |
| name | string | Nombre del proveedor |
| category | string | Categoría (café, cacao) |
| password | string | Contraseña hash (simulado) |
| status | string | Activo/Inactivo |

### Productos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | ID del producto |
| supplier_id | string | FK al proveedor |
| name | string | Nombre del producto |
| category | string | Categoría |
| status | string | Estado |

### Órdenes
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | ID de orden |
| supplier_id | string | FK al proveedor |
| date | string | Fecha |
| status | string | Estado |

### Lotes
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | ID del lote |
| supplier_id | string | FK al proveedor |
| product_type | string | Tipo de producto |
| region | string | Región |
| gross_weight | number | Peso bruto en KG |
| process | string | Proceso (lavado, natural, honey, otro) |
| packaging | string | Tipo de empaque |
| harvest_date | string | Fecha de cosecha |
| photos | string[] | URLs de fotos (max 10) |
| status | string | Estado |

### Pagos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | ID del pago |
| supplier_id | string | FK al proveedor |
| lot_id | string | ID del lote |
| percentage | number | Porcentaje pagado |
| amount | number | Monto |
| bank | string | Banco |
| date | string | Fecha |
| status | string | Enviado/Pagado/Pendiente |

## 5. Integraciones Backend
- Supabase: Opcional para futuro, inicialmente localStorage/mock
- Shopify: No necesario
- Stripe: No necesario

## 6. Plan de Fases de Desarrollo

### Fase 1: Página de Inicio y Layout Base
- Goal: Crear la página de inicio con Hero minimalista y diseño base
- Deliverable: Página Home con Hero, logo, botón CTA y diseño responsive

### Fase 2: Sistema de Autenticación
- Goal: Implementar login y registro por código de proveedor
- Deliverable: Página /auth con formularios de login y primer acceso, validación de códigos SUP-001 y SUP-002, creación de contraseña

### Fase 3: Dashboard - Panel Principal y Métricas
- Goal: Crear el dashboard privado con métricas resumen
- Deliverable: Dashboard con header, métricas cards, navegación lateral y protección de ruta

### Fase 4: Productos, Órdenes y Nuevo Lote
- Goal: Implementar secciones de productos, órdenes y formulario de nuevo lote
- Deliverable: Páginas de productos, órdenes y formulario de nuevo lote con validaciones

### Fase 5: Mis Lotes, Pagos, Contrato y Perfil
- Goal: Completar las secciones restantes del dashboard
- Deliverable: Páginas de lotes, pagos, contrato y configuración de perfil