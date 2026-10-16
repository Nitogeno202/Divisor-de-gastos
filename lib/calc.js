const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
export const money = (c) => fmt.format(c / 100);

export function parseAmount(s) {
  s = String(s).trim().replace(/\s|\$/g, '');
  if (!s) return NaN;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return isFinite(n) && n > 0 ? Math.round(n * 100) : NaN;
}

// saldo por persona en centavos: positivo = le deben, negativo = debe
export function balances(people, expenses) {
  const b = Object.fromEntries(people.map((p) => [p.id, 0]));
  for (const e of expenses) {
    const n = e.among.length, base = Math.floor(e.amount / n), rest = e.amount - base * n;
    b[e.payerId] += e.amount;
    e.among.forEach((id, i) => { b[id] -= base + (i < rest ? 1 : 0); });
  }
  return b;
}

// transferencias mínimas (greedy: el que más debe le paga al que más le deben)
export function settle(b) {
  const cr = [], de = [];
  for (const [id, v] of Object.entries(b)) { if (v > 0) cr.push({ id, v }); else if (v < 0) de.push({ id, v: -v }); }
  cr.sort((a, c) => c.v - a.v); de.sort((a, c) => c.v - a.v);
  const out = []; let i = 0, j = 0;
  while (i < de.length && j < cr.length) {
    const m = Math.min(de[i].v, cr[j].v);
    out.push({ from: de[i].id, to: cr[j].id, v: m });
    de[i].v -= m; cr[j].v -= m;
    if (!de[i].v) i++;
    if (!cr[j].v) j++;
  }
  return out;
}
