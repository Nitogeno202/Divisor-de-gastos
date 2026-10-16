import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const { name, people } = await req.json();
  const names = [...new Set((people || []).map((s) => String(s).trim()).filter(Boolean))].slice(0, 20);
  if (!String(name || '').trim() || names.length < 2)
    return Response.json({ error: 'Poné un nombre y al menos dos personas.' }, { status: 400 });
  const g = await db.group.create({
    data: { name: String(name).trim().slice(0, 60), people: { create: names.map((n) => ({ name: n.slice(0, 30) })) } },
  });
  return Response.json({ id: g.id });
}
