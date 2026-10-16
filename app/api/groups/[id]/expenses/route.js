import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
  const { desc, amount, payerId, among } = await req.json();
  const people = await db.person.findMany({ where: { groupId: params.id }, select: { id: true } });
  const ids = people.map((p) => p.id);
  const ok = String(desc || '').trim() && Number.isInteger(amount) && amount > 0 && amount < 2e9 &&
    ids.includes(payerId) && Array.isArray(among) && among.length && among.every((a) => ids.includes(a));
  if (!ok) return Response.json({ error: 'Datos inválidos' }, { status: 400 });
  const e = await db.expense.create({
    data: { desc: String(desc).trim().slice(0, 60), amount, payerId, among, groupId: params.id },
  });
  return Response.json(e);
}

export async function DELETE(req, { params }) {
  const eid = new URL(req.url).searchParams.get('eid');
  await db.expense.deleteMany({ where: { id: eid || '', groupId: params.id } });
  return Response.json({ ok: true });
}
