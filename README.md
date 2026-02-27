# Custodia App
## Sistema de Despacho para Negocios con Domicilio Propio — Colombia

> "El WhatsApp + papel ya no alcanza. Custodia organiza tus repartidores
> en tiempo real, elimina la confusión de pedidos y te da prueba de entrega."

---

## El problema que resuelve

En Colombia, 500.000+ tiendas y restaurantes gestionan sus repartidores
con WhatsApp, papel y llamadas telefónicas.

**Resultado:** Pedidos confundidos, repartidores que no contestan,
clientes que no saben dónde está su domicilio, y sin evidencia
si hay un reclamo.

**Custodia** resuelve esto con una solución accesible para PyMEs colombianas.

---

## Para quién es

- Asaderos, restaurantes y comidas rápidas con domicilio propio
- Droguerías con servicio a domicilio
- Tiendas de barrio que hacen entregas
- Pequeñas empresas de mensajería

---

## Cómo funciona

```
Cajera crea pedido (30 seg) → Asigna a repartidor (1 tap)
→ Repartidor recibe WhatsApp → Cliente recibe link de tracking
→ Repartidor toma foto al entregar → Evidencia guardada para siempre
```

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend / Backend | Next.js 15 (App Router + TypeScript) |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Base de datos | MongoDB 7.0 |
| Real-time | Socket.io |
| Mapas | Google Maps JavaScript API |
| Notificaciones | Twilio WhatsApp |
| Fotos | Cloudinary |
| Autenticación | NextAuth.js v5 + OTP |
| Pagos | Wompi Colombia |
| Contenedores | Docker + Docker Compose |
| Proxy / SSL | Nginx + Certbot (Let's Encrypt) |
| Servidor producción | Hostinger VPS (Ubuntu 22.04) |
| CI/CD | GitHub Actions |

---

## Estructura del proyecto

```
custodia-app/
├── investigacion/
│   ├── 01-market-research.md      ← TAM/SAM/SOM, competencia
│   ├── 02-requerimientos-SRS.md   ← Todos los requerimientos
│   └── 03-stack-tecnico.md        ← Decisiones técnicas y Docker
├── diseno/
│   └── wireframes/                ← Próximamente
├── arquitectura/
│   └── diagrama-sistema.md        ← Próximamente
├── docker-compose.dev.yml         ← MongoDB local para desarrollo
├── docker-compose.yml             ← Producción en Hostinger VPS
├── Dockerfile                     ← Build de la app Next.js
├── src/                           ← Código fuente Next.js 15
│   ├── src/app/                   ← App Router (páginas y layouts)
│   ├── src/components/            ← Componentes React + shadcn/ui
│   ├── src/lib/                   ← Utilidades y configuración
│   └── .env.local                 ← Variables de entorno (no en git)
└── README.md                      ← Este archivo
```

---

## Inicio rápido (desarrollo local)

```bash
# 1. Levantar MongoDB con Docker
docker compose -f docker-compose.dev.yml up -d

# 2. Instalar dependencias
cd src && npm install

# 3. Configurar variables de entorno
# Edita src/.env.local con tus valores

# 4. Iniciar el servidor de desarrollo
npm run dev

# 5. Ver MongoDB en el navegador
# http://localhost:8081 (Mongo Express)
```

---

## Autor

**Fernando Vega Benavides**
Desarrollador Web & Especialista en Automatización con IA
Bogotá, Colombia

- Email: fernando041581@gmail.com
- LinkedIn: linkedin.com/in/fernando-vega04/
- Tecnólogo en Gestión Logística (SENA)
- Certificado en Fundamentos de Ciberseguridad (Google)

---

## Estado del proyecto

- [x] Investigación de mercado completa
- [x] Documento de requerimientos (SRS)
- [x] Stack técnico definido
- [x] Setup inicial Next.js 15 + Tailwind + shadcn/ui
- [x] Docker Compose para desarrollo local
- [ ] Wireframes / diseño UI
- [ ] Sprint 1 — Core MVP (auth, pedidos, Kanban, fleet view)
- [ ] Sprint 2 — Real-time (Socket.io) + App repartidor (PWA)
- [ ] Sprint 3 — Notificaciones WhatsApp + Pagos Wompi
- [ ] Sprint 4 — Beta testing + Deploy producción
