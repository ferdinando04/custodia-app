# STACK TECNOLÓGICO DEFINITIVO — Custodia App
## Versión 2.0 — Con Hostinger VPS + Docker
### Autor: Fernando Vega Benavides | Feb 2026

---

## STACK FINAL (100% DEFINIDO)

```
┌─────────────────────────────────────────────────────────────────┐
│                  CUSTODIA APP — STACK DEFINITIVO                 │
├─────────────────────────────┬───────────────────────────────────┤
│ Frontend                    │ Next.js 15 + Tailwind + shadcn/ui  │
│ Backend                     │ Next.js API Routes + Socket.io     │
│ Base de datos               │ MongoDB 7.0                        │
│ Real-time                   │ Socket.io                          │
│ Mapas                       │ Google Maps JavaScript API         │
│ WhatsApp                    │ Twilio WhatsApp API                │
│ Fotos/Evidencia             │ Cloudinary                         │
│ Autenticación               │ NextAuth.js v5 + OTP               │
│ Pagos suscripción           │ Wompi Colombia                     │
│ Contenedores                │ Docker + Docker Compose            │
│ Proxy / SSL                 │ Nginx + Certbot (Let's Encrypt)    │
│ Servidor producción         │ Hostinger VPS                      │
│ Desarrollo local            │ Docker Compose (MongoDB local)     │
│ CI/CD                       │ GitHub Actions → deploy en VPS     │
│ Estilos                     │ Tailwind CSS v4                    │
│ Componentes UI              │ shadcn/ui                          │
└─────────────────────────────┴───────────────────────────────────┘
```

---

## POR QUÉ ESTE STACK CON HOSTINGER VPS

### Docker es OBLIGATORIO aquí (y eso es bueno)
```
Con VPS tienes control total → Docker organiza todo limpiamente:

Sin Docker:                    Con Docker:
❌ Instalar MongoDB manualmente  ✅ docker compose up
❌ Instalar Node.js y versiones  ✅ Todo en contenedores aislados
❌ Configurar Nginx a mano       ✅ Nginx en su propio contenedor
❌ Gestionar procesos con PM2    ✅ Docker gestiona los procesos
❌ "Funciona en mi PC pero no    ✅ Mismo entorno local y producción
    en el servidor"
```

### Ventaja para el CV de Fernando
```
Habilidades que el empleador verá en tu GitHub:
  ✅ Next.js 15 (App Router, Server Actions)
  ✅ TypeScript
  ✅ MongoDB + Mongoose
  ✅ Socket.io (WebSockets en tiempo real)
  ✅ Docker + Docker Compose (MUY demandado)
  ✅ Nginx (reverse proxy + SSL)
  ✅ CI/CD con GitHub Actions
  ✅ Tailwind CSS + shadcn/ui
  ✅ Integración Wompi Colombia
  ✅ Twilio WhatsApp API
  ✅ Google Maps API
```

---

## ARQUITECTURA EN PRODUCCIÓN (Hostinger VPS)

```
INTERNET
    │
    ▼
┌──────────────────────────────────────────────┐
│  HOSTINGER VPS (Ubuntu 22.04)                │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Docker Compose                        │  │
│  │                                        │  │
│  │  ┌──────────┐    ┌─────────────────┐  │  │
│  │  │  Nginx   │───▶│  Next.js App    │  │  │
│  │  │  :80/:443│    │  :3000          │  │  │
│  │  │  + SSL   │    │  (con Socket.io)│  │  │
│  │  └──────────┘    └────────┬────────┘  │  │
│  │                           │           │  │
│  │                           ▼           │  │
│  │                  ┌─────────────────┐  │  │
│  │                  │  MongoDB        │  │  │
│  │                  │  :27017         │  │  │
│  │                  │  (interno, no   │  │  │
│  │                  │   expuesto)     │  │  │
│  │                  └─────────────────┘  │  │
│  └────────────────────────────────────┘  │  │
└──────────────────────────────────────────┘  │
                                              │
Dominio: custodia.app ──────────────────────────┘
```

---

## ARQUITECTURA LOCAL (Tu PC con Docker)

```
Tu PC (Windows)
    │
    ▼
┌──────────────────────────────────────────────┐
│  Docker Desktop                              │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  docker-compose.dev.yml             │    │
│  │                                     │    │
│  │  ┌─────────────┐                    │    │
│  │  │  MongoDB    │◀── Next.js usa     │    │
│  │  │  :27017     │    esta DB         │    │
│  │  └─────────────┘                    │    │
│  │                                     │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │  Mongo Express              │    │    │
│  │  │  :8081 (ver tu DB visual)   │    │    │
│  │  └─────────────────────────────┘    │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  Next.js corre FUERA de Docker:              │
│  npm run dev → http://localhost:3000         │
└──────────────────────────────────────────────┘
```

---

## ARCHIVOS DOCKER QUE VAMOS A CREAR

### 1. `docker-compose.dev.yml` — Solo para desarrollo local
```yaml
services:
  mongodb:
    image: mongo:7.0
    container_name: custodia-mongo-dev
    ports:
      - "27017:27017"
    volumes:
      - mongo_data_dev:/data/db
    environment:
      MONGO_INITDB_DATABASE: custodia_dev

  mongo-express:
    image: mongo-express:1.0
    container_name: custodia-mongo-ui
    ports:
      - "8081:8081"
    depends_on:
      - mongodb
    environment:
      ME_CONFIG_MONGODB_SERVER: mongodb

volumes:
  mongo_data_dev:
```

### 2. `docker-compose.yml` — Producción en Hostinger VPS
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: custodia-app
    restart: always
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongodb:27017/custodia_prod
    depends_on:
      - mongodb
    networks:
      - custodia-network

  mongodb:
    image: mongo:7.0
    container_name: custodia-mongo
    restart: always
    volumes:
      - mongo_data_prod:/data/db
    networks:
      - custodia-network
    # NO exponer puerto 27017 al exterior (seguridad)

  nginx:
    image: nginx:alpine
    container_name: custodia-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - certbot_certs:/etc/letsencrypt
      - certbot_www:/var/www/certbot
    depends_on:
      - app
    networks:
      - custodia-network

networks:
  custodia-network:
    driver: bridge

volumes:
  mongo_data_prod:
  certbot_certs:
  certbot_www:
```

### 3. `Dockerfile` — Para la app Next.js
```dockerfile
# Multi-stage build — imagen liviana en producción
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## SKILLS INSTALADAS EN CLAUDE CODE

```
C:/Users/FERNANDO VEGA/.claude/skills/
├── shadcn-ui              ✅ Componentes UI profesionales
├── vercel-react-best-practices ✅ Optimización Next.js/React
├── nextjs-skills          ✅ Next.js 15 App Router (recién instalada)
├── react-components       ✅ Componentes React avanzados
├── design-md              ✅ Sistema de diseño
├── enhance-prompt         ✅ Mejorar prompts de UI
└── find-skills            ✅ Descubrir más skills
```

**Cómo se usan mientras desarrollamos:**
- `shadcn-ui` → cada vez que necesites un componente (botón, tabla, form)
- `vercel-react-best-practices` → cuando optimicemos rendimiento
- `nextjs-skills` → para patrones específicos de Next.js 15

---

## COSTOS TOTALES CON HOSTINGER VPS

```
Hostinger VPS:   YA PAGADO ✅ ($0 extra)
MongoDB:         En el VPS con Docker ($0)
Next.js:         En el VPS con Docker ($0)
Google Maps API: $0 (crédito gratuito $200/mes)
Twilio WhatsApp: ~$10 USD/mes (2.000 msgs)
Cloudinary:      $0 (free tier 25GB)
Wompi:           $0 (comisión solo al cobrar)
Dominio .app:    ~$15 USD/año (~$1.25/mes)
─────────────────────────────────────────
TOTAL MVP:       ~$11 USD/mes
```

**Ahorro vs. alternativas:**
- vs. Vercel Pro + Railway: -$14 USD/mes
- vs. todo en la nube: -$20 USD/mes

---

## PLAN DE DESARROLLO — 4 SPRINTS

### Pre-Sprint (Esta semana)
- [ ] Crear repositorio GitHub: `custodia-app`
- [ ] Setup Next.js 15 + TypeScript + Tailwind + shadcn/ui
- [ ] Crear `docker-compose.dev.yml` para MongoDB local
- [ ] Configurar variables de entorno (`.env.local`)
- [ ] Primer commit y push a GitHub

### Sprint 1 — Semana 1-2: Core MVP
- [ ] Schema MongoDB: businesses, riders, orders
- [ ] Auth con OTP (número celular)
- [ ] Crear pedido (formulario cajera)
- [ ] Tablero Kanban de pedidos
- [ ] Asignar pedido a repartidor
- [ ] Panel Fleet View (estado repartidores)

### Sprint 2 — Semana 3: Real-time + Repartidor
- [ ] Socket.io (tracking en tiempo real)
- [ ] App del repartidor (PWA — link único)
- [ ] Flujo: Tomé pedido → Entregué + foto
- [ ] Página de tracking para el cliente

### Sprint 3 — Semana 4: Notificaciones + Pagos
- [ ] WhatsApp automático (Twilio)
- [ ] Wompi Colombia (cobro suscripción)
- [ ] Dashboard dueño (métricas)
- [ ] Deploy en Hostinger VPS con Docker

### Sprint 4 — Mes 2: Beta y Pulido
- [ ] 3-5 negocios beta en Bosa
- [ ] Fix bugs del testing real
- [ ] Primer cobro real
