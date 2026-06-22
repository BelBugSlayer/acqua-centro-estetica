# Acqua Centro de Estetica

Proyecto final de **Base de Datos II**.

Sistema web simple para una estetica: muestra servicios, productos, permite solicitar turnos, registrar compras y guardar la informacion en MongoDB.

## Problema

Acqua puede recibir consultas por redes sociales o WhatsApp, anotar turnos de forma manual y vender productos sin un control centralizado de stock. Esto puede generar perdida de informacion, errores en horarios y dificultad para ver compras o reservas.

## Solucion

La aplicacion organiza:

- Servicios de estetica.
- Productos disponibles.
- Solicitud de turnos.
- Carrito de compras.
- Formas de pago: efectivo, tarjeta, transferencia y enlace demostrativo a Mercado Pago.
- Registro de datos en MongoDB.
- Visualizacion de la base desde MongoDB Compass.

## Tecnologias

- MongoDB
- MongoDB Compass
- Node.js
- Express
- Mongoose
- React + Vite
- Docker

## Estructura principal

```text
backend/      API con Express y modelos Mongoose
frontend/     Pagina web en React
mongo/        Validacion de colecciones
docs/         Documentacion, guion y publicacion
outputs/      Presentacion final
```

## Colecciones MongoDB

- `services`: servicios de la estetica.
- `products`: productos con stock.
- `appointments`: turnos solicitados.
- `orders`: compras realizadas.

## Ejecucion local

1. Instalar Node.js.
2. Instalar MongoDB Community Server.
3. Instalar MongoDB Compass.
4. Copiar `backend/.env.example` como `backend/.env`.
5. Instalar dependencias:

```bash
cd backend
npm install
cd ../frontend
npm install
```

6. Cargar datos iniciales:

```bash
cd backend
npm run seed
```

7. Ejecutar backend:

```bash
cd backend
npm run dev
```

8. Ejecutar frontend:

```bash
cd frontend
npm run dev
```

9. Abrir:

```text
http://localhost:5173
```

## Ejecucion con Docker

Para levantar MongoDB, backend y frontend juntos:

```bash
docker compose up --build
```

Abrir:

```text
http://localhost:5173
```

Detener:

```bash
docker compose down
```

Tambien se puede usar doble clic:

- `iniciar-acqua-docker.bat`
- `detener-acqua-docker.bat`

## Ver datos en MongoDB Compass

Conectar con:

```text
mongodb://127.0.0.1:27017
```

Base:

```text
acqua_estetica
```

Demo sugerida:

1. Solicitar turno desde la web.
2. Ver el nuevo documento en `appointments`.
3. Comprar un producto desde el carrito.
4. Ver el nuevo documento en `orders`.
5. Revisar `products` para explicar el stock.

## Publicacion

Para publicar sin ejecutar backend y frontend aparte:

- Frontend en GitHub Pages o Vercel.
- Backend en Render o Railway.
- Base de datos en MongoDB Atlas.

La guia completa esta en:

```text
docs/publicar-en-github-pages.md
```

## Archivos para entregar

- `outputs/presentacion-acqua-centro-estetica.pptx`
- `docs/guion-presentacion.md`
- `docs/preguntas-y-respuestas.md`
- `docs/publicar-en-github-pages.md`
- `docs/diseno-base-datos.md`
- `docs/guia-instalacion.md`
- Proyecto completo comprimido o enlace a GitHub/GitLab.
