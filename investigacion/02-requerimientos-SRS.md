# DOCUMENTO DE REQUERIMIENTOS DE SOFTWARE (SRS)
## Custodia App — Sistema de Despacho para Negocios con Domicilio Propio
### Versión 1.0 | Autor: Fernando Vega Benavides | Feb 2026
### Metodología: Research web exhaustivo + observación de campo (Bosa, Bogotá)

---

## 1. DESCRIPCIÓN DEL PRODUCTO

**Custodia** es una plataforma web progresiva (PWA) que permite a negocios pequeños
y medianos de Colombia gestionar sus domicilios propios: crear pedidos, asignar
repartidores, rastrear entregas en tiempo real y tener evidencia digital de entrega.

**Problema central que resuelve:**
El 79% de negocios colombianos gestiona sus repartidores por WhatsApp + papel,
generando confusión de pedidos, pérdida de tiempo y sin trazabilidad de entregas.

---

## 2. ACTORES DEL SISTEMA (USUARIOS)

### Actor 1 — El Negocio (Admin/Cajera)
**Perfil real:** La señora del asadero que atiende caja Y despacha al mismo tiempo
- No necesariamente tech-savvy
- Siempre ocupada, no puede usar interfaces complejas
- Necesita hacer todo en menos de 30 segundos por pedido
- Dispositivo: tablet o celular con Chrome (no necesita descargar nada)
- Contexto: ruidoso, ocupado, múltiples interrupciones

### Actor 2 — El Repartidor (Driver)
**Perfil real:** Persona en moto o bicicleta, afuera esperando o en ruta
- Recibe pedidos mientras conduce (mínimo de texto)
- Necesita la dirección y monto, nada más
- No quiere instalar apps — solo necesita un link que funcione
- Dispositivo: celular Android básico con datos móviles
- Contexto: en movimiento, manos ocupadas, pantalla pequeña

### Actor 3 — El Cliente Final
**Perfil real:** Persona en Bosa que pidió un domicilio
- Quiere saber cuándo llega, sin llamar al negocio
- Puede o no tener smartphone
- Necesita link simple que no requiera cuenta ni registro
- Puede pagar en efectivo, Nequi o tarjeta

### Actor 4 — El Dueño/Gerente (Vista global)
**Perfil:** Dueño del asadero, puede estar o no en el local
- Quiere ver cuántos pedidos van al día
- Quiere saber si hay problemas sin llamar a nadie
- Reportes simples: ingresos, pedidos, tiempos

---

## 3. REQUERIMIENTOS FUNCIONALES

### MÓDULO 1 — GESTIÓN DE PEDIDOS (Vista Cajera)

#### RF-01: Crear pedido rápido
**Descripción:** La cajera puede crear un pedido nuevo en menos de 30 segundos
**Campos requeridos:**
- Nombre del cliente (texto libre)
- Número de teléfono del cliente (para enviar tracking)
- Dirección de entrega (texto libre + autocompletar Google Maps)
- Descripción del pedido (texto libre, ej: "1 pollo + papas + gaseosa")
- Valor del pedido (número)
- Forma de pago: Efectivo / Nequi / Tarjeta
- Notas adicionales (opcional, ej: "tocar timbre 3 veces")

**Reglas de negocio:**
- Solo nombre + dirección + valor son obligatorios
- El sistema asigna número de pedido automático (#001, #002...)
- Al crear, el pedido queda en estado "Pendiente"

**Criterios de aceptación:**
- [ ] Formulario visible en pantalla completa, botones grandes
- [ ] Autocompletado de direcciones Google Maps activo
- [ ] Crear pedido en máximo 3 taps/clics
- [ ] Feedback visual inmediato al guardar ("¡Pedido creado!")

---

#### RF-02: Tablero Kanban de pedidos en tiempo real
**Descripción:** La cajera ve todos los pedidos del día en columnas por estado
**Estados del pedido:**
```
PENDIENTE → ASIGNADO → EN CAMINO → ENTREGADO → CANCELADO
```
**Información visible por pedido:**
- Número de pedido (#047)
- Nombre del cliente
- Dirección (resumida)
- Valor y forma de pago
- Repartidor asignado
- Tiempo transcurrido desde creación
- Botón de acción principal según estado

**Criterios de aceptación:**
- [ ] Se actualiza en tiempo real (sin recargar página)
- [ ] Visible en tablet horizontal y celular vertical
- [ ] Pedidos urgentes (>30 min sin asignar) se resaltan en rojo
- [ ] Máximo 2 clics para cualquier acción sobre un pedido

---

#### RF-03: Asignar pedido a repartidor
**Descripción:** Con un tap, la cajera asigna un pedido a un repartidor disponible
**Flujo:**
1. Cajera toca pedido "Pendiente"
2. Ve lista de repartidores con estado (Verde=libre, Amarillo=entregando)
3. Toca el repartidor → pedido pasa a "Asignado"
4. Repartidor recibe WhatsApp automático con detalles

**Reglas de negocio:**
- Un repartidor puede tener máximo 3 pedidos activos simultáneos
- El sistema sugiere el repartidor más cercano (si GPS activo)
- Si todos están ocupados, alerta visual a la cajera

**Criterios de aceptación:**
- [ ] Asignación completa en 1 tap
- [ ] Estado de repartidores visible y actualizado en tiempo real
- [ ] WhatsApp enviado en menos de 5 segundos tras asignación

---

#### RF-04: Panel de repartidores (Fleet View)
**Descripción:** La cajera ve todos sus repartidores y su estado actual
```
┌────────────────────────────────────────┐
│ REPARTIDORES                           │
│ 🟢 Carlos    — LIBRE         [Asignar] │
│ 🟡 Miguel    — En ruta (#47) [Ver]     │
│ 🟢 Jhon      — LIBRE         [Asignar] │
│ 🔴 Pedro     — Sin señal ⚠️  [Llamar]  │
└────────────────────────────────────────┘
```
**Estados del repartidor:**
- 🟢 Libre: Sin pedido activo, disponible
- 🟡 En ruta: Tiene pedido(s) activo(s), está entregando
- 🔴 Sin señal: No actualiza ubicación hace >10 minutos (alerta)
- ⚫ Desconectado: No ha abierto la app en el turno

---

### MÓDULO 2 — APP DEL REPARTIDOR (PWA — Sin instalar)

#### RF-05: Acceso del repartidor sin registro
**Descripción:** El repartidor accede por link único, sin descargar app ni crear cuenta
**Flujo:**
1. Negocio invita al repartidor con un link único (ej: custodia.app/r/carlos123)
2. Repartidor abre el link en Chrome
3. Acepta compartir ubicación
4. Listo — ya aparece en el panel del negocio

**Criterios de aceptación:**
- [ ] Link funciona en cualquier Android con Chrome
- [ ] Sin formularios de registro
- [ ] Solicita permiso de ubicación una sola vez
- [ ] Funciona con conexión 3G (no requiere 4G/WiFi)

---

#### RF-06: Vista de pedidos del repartidor
**Descripción:** El repartidor ve SUS pedidos con información clara y accionable
```
┌─────────────────────────────────┐
│  📦 PEDIDO #049 — NUEVO         │
│                                 │
│  👤 Diana Moreno                │
│  📍 Cra 80 #72-15, Bosa        │
│  🗺️  [ABRIR EN GOOGLE MAPS]    │
│                                 │
│  🍗 1 pollo + papas + jugo      │
│  💵 $25.000 — EFECTIVO          │
│                                 │
│  📝 "Tocar timbre 2 veces"      │
│                                 │
│  [📸 TOMÉ EL PEDIDO]            │
└─────────────────────────────────┘
```
**Reglas de negocio:**
- El repartidor solo ve SUS pedidos asignados
- Información no editable (solo lectura)
- Botones grandes para uso con una mano

---

#### RF-07: Flujo de estados del repartidor
**Descripción:** El repartidor actualiza el estado con fotos como evidencia

**Estado 1 — "Tomé el pedido" (al recoger en el negocio):**
- Toca botón "Tomé el pedido"
- Opcionalmente toma foto del pedido empacado
- Pedido cambia a "En camino" en el tablero de la cajera
- El cliente recibe WhatsApp con link de tracking

**Estado 2 — "Entregué" (al llegar donde el cliente):**
- Toca botón "Entregué"
- Toma foto como prueba (obligatorio en plan Pro)
- Opcionalmente captura firma digital del cliente
- Pedido cambia a "Entregado" en el tablero

**Estado 3 — "No pude entregar" (si no abrieron):**
- Motivo: No contestó / Dirección incorrecta / Canceló
- Foto opcional
- Alerta inmediata a la cajera

**Criterios de aceptación:**
- [ ] Cada acción requiere máximo 2 taps
- [ ] Foto capturada automáticamente con timestamp y coordenadas GPS
- [ ] Sin posibilidad de marcar como entregado sin foto (plan Pro)
- [ ] Funciona offline y sincroniza cuando hay conexión

---

#### RF-08: Tracking GPS del repartidor
**Descripción:** La ubicación del repartidor se actualiza cada 30 segundos
**Reglas de negocio:**
- GPS activo solo cuando el repartidor tiene pedidos activos
- Se desactiva automáticamente cuando está "Libre" (privacidad)
- Precisión mínima: 50 metros
- Funciona en background (sin tener el link abierto)

---

### MÓDULO 3 — TRACKING PARA EL CLIENTE FINAL

#### RF-09: Link de tracking público (sin registro)
**Descripción:** El cliente recibe un link único que muestra dónde está su pedido
**URL ejemplo:** `custodia.app/track/abc123xyz`

**Información visible:**
```
┌────────────────────────────────┐
│  🛵 Tu pedido va en camino     │
│  Asadero El Buen Sabor         │
│                                │
│  [MAPA CON PUNTO DEL RIDER]    │
│                                │
│  📍 A ~8 minutos de llegar     │
│  Repartidor: Carlos            │
│                                │
│  Estado: ● En camino           │
│                                │
│  ¿Problemas? Llama al negocio  │
│  📞 [301 234 5678]             │
└────────────────────────────────┘
```
**Reglas de negocio:**
- Link válido por 4 horas desde creación del pedido
- No requiere cuenta ni registro del cliente
- Funciona en cualquier navegador sin instalar nada
- Si el pedido es entregado, muestra confirmación con hora

---

### MÓDULO 4 — NOTIFICACIONES AUTOMÁTICAS (WhatsApp)

#### RF-10: WhatsApp automático al repartidor
**Trigger:** Al asignar un pedido
**Mensaje:**
```
🛵 *Nuevo domicilio asignado — Asadero El Buen Sabor*

📦 Pedido #049
👤 Diana Moreno — 📞 311 234 5678
📍 Cra 80 #72-15, Bosa
🍗 1 pollo + papas + jugo
💵 $25.000 — EFECTIVO
📝 Tocar timbre 2 veces

🗺️ Ver dirección: [link Google Maps]
✅ Gestionar pedido: [link app]
```

#### RF-11: WhatsApp automático al cliente
**Trigger:** Cuando el repartidor toca "Tomé el pedido"
**Mensaje:**
```
¡Hola Diana! 👋

Tu pedido de *Asadero El Buen Sabor* ya va en camino 🛵

Rastrea tu domicilio aquí:
👉 custodia.app/track/abc123

Tu repartidor es Carlos.
Tiempo estimado: ~15 minutos

¿Dudas? Escríbenos: [WhatsApp del negocio]
```

#### RF-12: WhatsApp al negocio si hay problema
**Trigger:** Repartidor sin señal por más de 10 minutos
**Mensaje a la cajera:**
```
⚠️ ALERTA — Custodia App

Carlos lleva 12 minutos sin actualizar ubicación.
Tiene el pedido #049 de Diana Moreno activo.

Considera llamarlo: [botón llamar]
```

---

### MÓDULO 5 — REPORTES Y ANALYTICS

#### RF-13: Dashboard del dueño/gerente
**Descripción:** Vista consolidada del negocio para el dueño
**Métricas del día:**
- Total pedidos: X
- Entregados: X ✅ | En camino: X 🟡 | Pendientes: X ⏳
- Ingresos totales del día: $XXX.XXX COP
- Tiempo promedio de entrega: XX minutos
- Pedidos con problema: X ⚠️

**Métricas del mes:**
- Pedidos por día (gráfico de barras)
- Repartidor más eficiente (por tiempo y pedidos)
- Hora pico de domicilios (para planear turnos)
- Tasa de éxito de entregas (%)

#### RF-14: Historial de pedidos con evidencia
**Descripción:** Registro permanente de todos los pedidos con pruebas
- Búsqueda por fecha, cliente, repartidor
- Ver foto de entrega por pedido
- Exportar reporte en PDF o Excel
- Útil para: resolver disputas, contabilidad, auditorías

---

### MÓDULO 6 — ADMINISTRACIÓN DEL NEGOCIO

#### RF-15: Registro y configuración del negocio
**Campos:**
- Nombre del negocio
- Logo (opcional)
- Teléfono de WhatsApp
- Dirección del local (punto de origen en el mapa)
- Zonas de cobertura (radio en km o polígono en mapa)
- Horario de atención

#### RF-16: Gestión de repartidores
**Acciones disponibles:**
- Agregar repartidor (nombre + teléfono → recibe link de acceso)
- Desactivar repartidor temporalmente (vacaciones, etc.)
- Ver historial de pedidos por repartidor
- Ver calificaciones de entregas

#### RF-17: Registro con número de celular (OTP)
**Flujo:**
1. Ingresar número colombiano (+57)
2. Recibir código OTP por SMS o WhatsApp
3. Ingresar código → acceso inmediato
4. Sin contraseñas complicadas

---

## 4. REQUERIMIENTOS NO FUNCIONALES

### RNF-01: Rendimiento
- Tiempo de carga inicial: < 3 segundos (red 3G)
- Tiempo de respuesta al crear pedido: < 1 segundo
- Actualización de tracking: cada 30 segundos
- Disponibilidad: 99.5% uptime (máximo 3.6 hrs/mes de caída)

### RNF-02: Usabilidad (Crítico para este producto)
- Texto mínimo 16px en interfaces del repartidor
- Botones mínimo 48x48px (accesibilidad táctil)
- Contraste suficiente para uso en exteriores (sol directo)
- Cero formularios de más de 5 campos
- Funciona sin tutorial previo (onboarding de 60 segundos)
- 100% en español colombiano (no anglicismos)

### RNF-03: Compatibilidad
- Funciona en Android 8+ (cobertura >95% de dispositivos Colombia)
- Funciona en iOS 13+
- Funciona en Chrome, Firefox, Samsung Internet
- Sin instalación requerida (PWA)
- Resoluciones: 320px - 1920px

### RNF-04: Seguridad
- HTTPS obligatorio en todos los endpoints
- Links de tracking con token único (no predecibles)
- Datos de clientes no expuestos a repartidores (solo nombre y dirección)
- Autenticación OTP para negocios (no contraseñas débiles)
- Rate limiting en endpoints de creación de pedidos
- Fotos de evidencia almacenadas en CDN seguro (no URL pública predecible)

### RNF-05: Offline / Conectividad
- El repartidor puede ver sus pedidos sin conexión
- Las fotos de entrega se guardan localmente y sincronizan al reconectarse
- Alertas cuando no hay conexión ("Sin internet — tus datos están guardados")

### RNF-06: Escalabilidad
- Arquitectura que soporte de 1 a 10.000 negocios sin cambios mayores
- Base de datos con índices en: negocio_id, fecha, estado, repartidor_id
- Imágenes de evidencia en CDN (no en servidor propio)

---

## 5. REQUERIMIENTOS DE INTEGRACIÓN

### INT-01: WhatsApp Business API (Twilio o Meta Cloud)
- Enviar mensajes automáticos a repartidores y clientes
- Límite gratuito: 1.000 mensajes/mes (Meta Cloud API)
- Costo adicional: ~$0.05 USD por mensaje extra

### INT-02: Google Maps Platform
- Autocompletado de direcciones en creación de pedidos
- Mapa de tracking para el cliente
- Cálculo de distancia y ETA
- Límite gratuito: $200 USD/mes en créditos (~28.000 requests)

### INT-03: Wompi Colombia (Pagos de suscripción)
- Para cobrar la suscripción mensual a los negocios
- Métodos: tarjeta, Nequi, PSE, Bancolombia
- Comisión: 2.99% + IVA
- Gratis primeros 3 meses

### INT-04: Cloudinary (Almacenamiento de fotos)
- Fotos de evidencia de entrega
- Plan gratuito: 25GB almacenamiento, 25GB bandwidth/mes
- Transformaciones automáticas (resize, compresión)

### INT-05: Firebase / OneSignal (Notificaciones push)
- Alertas al negocio cuando hay problema
- Notificaciones de nuevo pedido al repartidor
- Plan gratuito suficiente para MVP

---

## 6. HISTORIAS DE USUARIO PRIORIZADAS

### SPRINT 1 — MVP Core (Semanas 1-2)
| ID | Historia | Prioridad |
|----|---------|-----------|
| US-01 | Como cajera, quiero crear un pedido en 30 segundos | 🔴 CRÍTICA |
| US-02 | Como cajera, quiero ver todos mis pedidos del día en un tablero | 🔴 CRÍTICA |
| US-03 | Como cajera, quiero asignar un pedido a un repartidor con 1 tap | 🔴 CRÍTICA |
| US-04 | Como repartidor, quiero recibir el pedido en WhatsApp con la dirección | 🔴 CRÍTICA |
| US-05 | Como repartidor, quiero abrir el link y ver mis pedidos sin instalar nada | 🔴 CRÍTICA |
| US-06 | Como repartidor, quiero marcar un pedido como entregado | 🔴 CRÍTICA |
| US-07 | Como cajera, quiero ver qué repartidores están libres y cuáles entregando | 🔴 CRÍTICA |

### SPRINT 2 — Diferenciador (Semanas 3-4)
| ID | Historia | Prioridad |
|----|---------|-----------|
| US-08 | Como cliente, quiero recibir un link para ver dónde está mi pedido | 🟠 ALTA |
| US-09 | Como cliente, quiero ver el mapa con la ubicación del repartidor en tiempo real | 🟠 ALTA |
| US-10 | Como repartidor, quiero tomar una foto al entregar como prueba | 🟠 ALTA |
| US-11 | Como negocio, quiero que el cliente reciba WhatsApp automático cuando sale el pedido | 🟠 ALTA |
| US-12 | Como dueño, quiero ver cuántos pedidos y cuánto dinero hice hoy | 🟠 ALTA |

### SPRINT 3 — Polish y Retención (Mes 2)
| ID | Historia | Prioridad |
|----|---------|-----------|
| US-13 | Como dueño, quiero ver reportes del mes con gráficas | 🟡 MEDIA |
| US-14 | Como cajera, quiero recibir alerta si un repartidor lleva mucho tiempo sin señal | 🟡 MEDIA |
| US-15 | Como negocio, quiero exportar el historial de pedidos en Excel | 🟡 MEDIA |
| US-16 | Como repartidor, quiero ver mis entregas del día y mis ganancias | 🟡 MEDIA |
| US-17 | Como negocio, quiero gestionar múltiples sucursales desde una cuenta | 🟢 BAJA |

---

## 7. FLUJO COMPLETO DEL SISTEMA (Happy Path)

```
[CLIENTE llama o escribe] ──→ [CAJERA crea pedido en 30 seg]
                                        │
                                        ▼
                          [Sistema asigna número #049]
                          [Pedido aparece en tablero: PENDIENTE]
                                        │
                                        ▼
                    [CAJERA ve repartidores → Carlos está libre]
                    [Tap en Carlos → pedido pasa a ASIGNADO]
                                        │
                          ┌─────────────┴─────────────┐
                          ▼                           ▼
              [CARLOS recibe WhatsApp]    [Tablero actualiza:
               con detalles completos]    Carlos → En ruta]
                          │
                          ▼
            [Carlos abre link → ve pedido #049]
            [Toca "Tomé el pedido" + foto opcional]
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
    [Pedido → EN CAMINO]  [CLIENTE recibe WhatsApp:
                           "Tu pedido va en camino 🛵"
                           + link de tracking]
                │
                ▼
    [CLIENTE abre link → ve mapa con Carlos en tiempo real]
                │
                ▼
    [Carlos llega → toca "Entregué" + foto de entrega]
                │
        ┌───────┴───────┐
        ▼               ▼
[Pedido → ENTREGADO]  [CAJERA ve: ✅ #049 entregado]
[Foto guardada]       [DUEÑO ve en dashboard: +$25.000 COP]
```

---

## 8. CRITERIOS DE ÉXITO DEL MVP

Al finalizar el Sprint 1+2 (4 semanas), el producto es exitoso si:

- [ ] Un negocio nuevo puede registrarse y crear su primer pedido en < 5 minutos
- [ ] El repartidor puede acceder y ver sus pedidos sin ayuda de nadie
- [ ] El cliente puede rastrear su pedido desde el link de WhatsApp
- [ ] El sistema soporta 100 pedidos/día sin degradación
- [ ] Al menos 3 negocios beta están usando el producto activamente
- [ ] La cajera del asadero puede usarlo sin explicación previa (test clave)

---

## Fuentes de los requerimientos
- Observación directa: Asadero en Bosa, Bogotá (Fernando Vega, Feb 2026)
- Shipday.com — Restaurant Delivery Management Software Guide
- EatFresh.tech — Restaurant Delivery Management Software Essentials
- Vonzu.io — 5 Problemas entregas en restaurantes
- Tryotter.com — 5 problemas del reparto a domicilio
- Track-POD — Delivery Driver App requirements
- DispatchTrack — Food Delivery Dispatch Software
- Locate2u — Why every restaurant needs a driver app
- VROMO — Features restaurant delivery system
