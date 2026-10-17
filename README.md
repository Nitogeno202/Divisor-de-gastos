# A medias · Divisor de gastos

Aplicación web para dividir gastos cuando salís con amigos. Armás un grupo, cargás quién pagó cada cosa y la app te dice **quién le paga a quién** para quedar a mano, con la menor cantidad de transferencias posible.

🔗 **Probala acá:** [(https://divisor-de-gastos-t6ww.onrender.com/)]

> Es un proyecto chico que hice para practicar, con ayuda de IA para armarlo y entender cómo funciona todo.

## Qué hace

- Creás un grupo con un nombre y las personas que participan.
- Cargás gastos: qué fue, cuánto costó, quién pagó y entre quiénes se divide.
- Ves el saldo de cada uno y las transferencias para saldar las cuentas.
- Cada grupo tiene un link único (`/g/<id>`): quien lo tenga puede ver y cargar gastos desde su celular. No hace falta registrarse.

## Tecnologías

| Tecnología | Para qué se usa |
|---|---|
| [Next.js 14](https://nextjs.org/) (App Router) | Frontend y backend en un solo proyecto |
| [React](https://react.dev/) | Interfaz y estado de las pantallas |
| [Prisma](https://www.prisma.io/) | ORM para consultar la base sin escribir SQL |
| [PostgreSQL](https://www.postgresql.org/) en [Neon](https://neon.tech/) | Base de datos |
| CSS plano | Estilos, sin librerías |
| [Render](https://render.com/) | Hosting |

## Estructura

```
app/
  page.js                      Inicio: crear grupo
  g/[id]/page.js               Pantalla del grupo
  api/groups/                  API (crear grupo, ver grupo, cargar y borrar gastos)
  layout.js, globals.css       Marco común y estilos
lib/
  calc.js                      Lógica: saldos y transferencias mínimas
  db.js                        Conexión a la base
prisma/
  schema.prisma                Modelo de datos (Group, Person, Expense)
```

## Cómo funciona la lógica

- Los montos se guardan en **centavos enteros**, así no se pierde plata por redondeos.
- Cuando un gasto no se divide exacto, los centavos sobrantes se reparten entre los participantes.
- El saldo de cada persona es lo que puso menos lo que le tocaba pagar.
- Para saldar, se empareja a quien más debe con quien más le deben (algoritmo greedy), lo que reduce la cantidad de transferencias.
- El servidor valida todos los datos que recibe en cada ruta de la API.

## Correrlo en local

1. Instalá las dependencias:
   ```bash
   npm install
   ```
2. Creá un archivo `.env` con la conexión a tu base PostgreSQL:
   ```
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@HOST/BASE?sslmode=require"
   ```
3. Creá las tablas:
   ```bash
   npx prisma db push
   ```
4. Levantá el servidor:
   ```bash
   npm run dev
   ```
   y abrí http://localhost:3000

## Deploy (gratis)

1. Creá una base en [Neon](https://neon.tech/) y copiá la connection string (conexión directa, sin pooler).
2. Subí el repo a GitHub.
3. En [Render](https://render.com/): **New → Web Service**, conectá el repo y configurá:
   - **Build Command:** `npm install && npx prisma db push && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. En **Environment** agregá:
   - `DATABASE_URL` con tu connection string de Neon
   - `NODE_VERSION` con valor `20`

> En el plan gratuito de Render la app se duerme tras 15 minutos sin uso, así que la primera visita puede tardar cerca de un minuto en despertar.

## Limitaciones y próximos pasos

- El link del grupo es la única protección: cualquiera que lo tenga puede editar.
- Las personas se definen al crear el grupo y no se pueden agregar después.
- Ideas para sumar: agregar personas a un grupo existente, historial de grupos en el navegador, compartir el resumen por WhatsApp y división desigual (por porcentaje o monto fijo).
