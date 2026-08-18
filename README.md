# 🛒 Full-Stack E-Commerce Payment Checkout

Solución completa para catálogo de productos y flujo de compra con pasarela de pagos Wompi (Sandbox), construida con **NestJS**, **PostgreSQL**, **TypeORM**, **React (TypeScript)**, **Redux Toolkit** y **Tailwind CSS**.

---

## 📁 Estructura del Repositorio

* **`Back/`**: API RESTful en NestJS, persistencia en PostgreSQL con TypeORM, validación de DTOs, cálculo de firma de integridad SHA-256 y pruebas unitarias con Jest.
* **`Front/`**: SPA en React + Vite con TypeScript, gestión de estado global con Redux Toolkit, diseño responsive con Tailwind CSS y pruebas con Vitest.

---

## ⚙️ Inicio Rápido

### 1. Backend (NestJS)
```bash
cd Back
cp .env.example .env
npm install
npm run start:dev
```
* **API Docs (Swagger):** `http://localhost:3000/api/docs`

### 2. Frontend (React + Vite)
```bash
cd Front/Front
npm install
npm run dev
```
* **Aplicación Web:** `http://localhost:5173/`

---

## 🧪 Pruebas Unitarias

* **Backend (Jest):**
```bash
cd Back
npm run test
```

* **Frontend (Vitest):**
```bash
cd Front/Front
npm run test
```

---

## 💳 Tarjetas de Prueba (Wompi Sandbox)

| Estado | Número de Tarjeta | Vencimiento | CVC |
| :--- | :--- | :--- | :--- |
| **Aprobada** | `4242 4242 4242 4242` | `12/30` | `123` |
| **Rechazada** | `4000 0000 0000 0005` | `12/30` | `123` |
