# A medias · Divisor de gastos

Next.js 14 (App Router) + Prisma + PostgreSQL. Todo gratis en Vercel + Neon.

## Local
1. `npm install`
2. Copiá `.env.example` a `.env` y poné tu `DATABASE_URL` (Postgres).
3. `npx prisma db push` (crea las tablas)
4. `npm run dev` → http://localhost:3000

## Deploy gratis
1. Creá una base en https://neon.tech (plan free) y copiá la connection string.
2. Con esa URL en `.env`, corré una vez `npx prisma db push`.
3. Subí el proyecto a GitHub.
4. En https://vercel.com: New Project → importá el repo → agregá la variable `DATABASE_URL` → Deploy.

## Cómo funciona
- Cada grupo tiene un link único (`/g/<id>`): quien lo tenga puede ver y cargar gastos.
- Los montos se guardan en centavos (enteros) para evitar errores de redondeo.
- `lib/calc.js` tiene el cálculo de saldos y de transferencias mínimas.
