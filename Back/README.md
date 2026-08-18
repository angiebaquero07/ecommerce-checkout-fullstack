# 💳 E-Commerce Payment Checkout API (Backend)

API RESTful construida con **NestJS**, **TypeORM** y **PostgreSQL** para la gestión de productos, procesamiento de cobros y orquestación de transacciones mediante la pasarela de pagos Wompi (Sandbox).

---

## 🛠️ Tecnologías y Características

- **Framework:** NestJS (Node.js + TypeScript)
- **Base de Datos:** PostgreSQL con TypeORM
- **Validación de Datos:** `class-validator` y `class-transformer`
- **Documentación:** Swagger / OpenAPI
- **Pruebas Unitarias:** Jest (>80% coverage)
- **Arquitectura:** Hexagonal / Ports & Adapters y ROP (Railway Oriented Programming) en progreso.
- **Seguridad:** CORS configurado, validación de DTOs, cálculo de firma de integridad en servidor mediante algoritmo SHA-256.
- **Inicialización (Seed):** Carga automática del producto inicial al arrancar el servicio.

---

## 📋 Requisitos Previos

- Node.js v18 o superior
- Instancia de PostgreSQL activa y base de datos creada (`checkout_db`)

---

## ⚙️ Configuración y Variables de Entorno

Crea un archivo llamado `.env` en la raíz del backend (`Back/.env`) con las siguientes variables:

```env
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=checkout_db

# Wompi Sandbox
WOMPI_API_URL=https://api-sandbox.co.uat.wompi.dev/v1
WOMPI_PUBLIC_KEY=pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7
WOMPI_PRIVATE_KEY=prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg
WOMPI_INTEGRITY_KEY=stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp
```

---

## 🚀 Instalación y Ejecución

**1. Instalar dependencias:**
```bash
npm install
```

**2. Iniciar en modo desarrollo:**
```bash
npm run start:dev
```

**3. Compilar y ejecutar en producción:**
```bash
npm run build
npm run start:prod
```

---

## 📖 Documentación de la API (Swagger)

Con el servidor en ejecución, accede a la documentación interactiva en tu navegador:

**URL:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/products` | Obtiene la lista de productos disponibles con su stock actual |
| `GET` | `/products/:id` | Obtiene el detalle de un producto por ID |
| `GET` | `/checkout/merchant` | Consulta datos del comercio y tokens de aceptación de la pasarela |
| `POST` | `/checkout/pay` | Procesa el cobro, calcula la firma y descuenta stock si la transacción es aprobada |
| `GET` | `/checkout/transaction/:id` | Consulta el registro de una transacción por ID |

---

## 🧪 Pruebas Unitarias

Ejecutar las pruebas unitarias de los servicios (productos y checkout) con Jest:

```bash
# Ejecutar todas las pruebas
npm run test

# Para ver la cobertura de código (Code Coverage)
npm run test:cov
```