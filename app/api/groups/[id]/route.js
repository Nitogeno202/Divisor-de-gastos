import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const g = await db.group.findUnique({
    where: { id: params.id },
    include: { people: true, expenses: { orderBy: { createdAt: 'asc' } } },
  });
  if (!g) return Response.json({ error: 'No existe' }, { status: 404 });
  return Response.json(g);
}
