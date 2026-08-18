# 🛒 E-Commerce Payment Checkout Web (Frontend)

Aplicación web Single Page Application (SPA) construida con **React**, **TypeScript**, **Vite**, **Redux Toolkit** y **Tailwind CSS**. Implementa el catálogo de producto, el modal de checkout por pasos, la tokenización directa de tarjetas con la pasarela de pagos Wompi (Sandbox) y la visualización reactiva del estado de la transacción.

---

## 🛠️ Tecnologías y Características

- **Framework / Bundler:** React (TypeScript) con Vite
- **Gestión de Estado Global:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Estilos:** Tailwind CSS v4
- **Iconografía:** Lucide React
- **Cliente HTTP:** Axios
- **Pruebas Unitarias:** Vitest
- **Seguridad & Tokenización:** Comunicación directa con la API pública de Wompi para tokenizar tarjetas en el cliente sin exponer credenciales sensibles en backend ni base de datos.
- **Flujo de Usuario:** Modal multi-paso con validaciones de formulario, aceptación de términos legales y manejo reactivo de inventario.

---

## 📋 Requisitos Previos

- Node.js v18 o superior
- Servidor Backend (NestJS) en ejecución en `http://localhost:3000`

---

## 🚀 Instalación y Ejecución

**1. Instalar dependencias:**
```bash
npm install
```

**2. Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

**3. Acceder en el navegador:**

URL: [http://localhost:5173/](http://localhost:5173/)

**4. Compilar para producción:**
```bash
npm run build
```

---

## 🛒 Flujo de Compra Implementado

- **Catálogo de Producto:** Consulta reactiva de stock, precio formateado en COP y detalles del producto desde la API.
- **Paso 1 (Tarjeta):** Captura de datos de tarjeta, cuotas y validación obligatoria de la casilla de aceptación de términos y políticas del comercio.
- **Paso 2 (Entrega):** Captura de datos del cliente (nombre, email, teléfono) y dirección de envío (dirección, ciudad, departamento).
- **Paso 3 (Resumen):** Desglose detallado del valor del producto, tarifa base ($5.000 COP) y tarifa de entrega ($10.000 COP).
- **Paso 4 (Estado de la Transacción):** Pantalla de confirmación con referencia única, ID de transacción de pasarela, monto total y estado final (`APPROVED` o `DECLINED`).

---

## 🧪 Pruebas Unitarias

Ejecución de pruebas sobre los reducers, acciones y mutaciones del estado global (`checkoutSlice`) con Vitest:

```bash
npm run test
```

---

## 💳 Tarjetas de Prueba (Sandbox Wompi)

| Caso de Prueba | Número de Tarjeta | Mes / Año | CVC | Cuotas | Resultado Esperado |
|---|---|---|---|---|---|
| Transacción Aprobada | `4242 4242 4242 4242` | 12/30 | 123 | 1 | `APPROVED` (Descuenta stock) |
| Transacción Rechazada | `4000 0000 0000 0005` | 12/30 | 123 | 1 | `DECLINED` |