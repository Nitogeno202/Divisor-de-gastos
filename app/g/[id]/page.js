'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { parseAmount, money, balances, settle } from '@/lib/calc';

const COLORS = ['#FFD447', '#FF7A7A', '#35C9A0', '#9DB0FF', '#FFA45B', '#C99BF2'];

export default function Group() {
  const { id } = useParams();
  const [g, setG] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [among, setAmong] = useState([]);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const r = await fetch(`/api/groups/${id}`, { cache: 'no-store' });
    if (!r.ok) { setNotFound(true); return; }
    const d = await r.json();
    setG(d);
    setPayer((p) => p || d.people[0].id);
    setAmong((a) => (a.length ? a : d.people.map((p) => p.id)));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (notFound) return <div className="card"><h2>Ups, este grupo no existe</h2><p><a href="/">Armá uno nuevo</a></p></div>;
  if (!g) return <p className="muted">Cargando…</p>;

  const idx = (pid) => g.people.findIndex((p) => p.id === pid);
  const name = (pid) => g.people[idx(pid)]?.name || '?';
  const Av = ({ pid }) => <span className="av" style={{ background: COLORS[idx(pid) % COLORS.length] }}>{name(pid)[0]?.toUpperCase()}</span>;
  const bal = balances(g.people, g.expenses);
  const pays = settle(bal);
  const total = g.expenses.reduce((a, e) => a + e.amount, 0);

  async function add() {
    const cents = parseAmount(amount);
    if (!desc.trim()) return setMsg('Poné qué fue el gasto.');
    if (isNaN(cents)) return setMsg('Ese monto no se entiende. Probá con 12.500,50');
    if (!among.length) return setMsg('Elegí entre quiénes se divide.');
    const r = await fetch(`/api/groups/${id}/expenses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desc, amount: cents, payerId: payer, among }),
    });
    if (!r.ok) return setMsg('No se pudo guardar. Probá de nuevo.');
    setDesc(''); setAmount(''); setMsg(''); load();
  }
  async function del(eid) {
    await fetch(`/api/groups/${id}/expenses?eid=${eid}`, { method: 'DELETE' });
    load();
  }
  async function copy() {
    try { await navigator.clipboard.writeText(location.href); setMsg('¡Link copiado! Mandalo al grupo.'); } catch { setMsg(location.href); }
  }
  const toggle = (pid) => setAmong((a) => (a.includes(pid) ? a.filter((x) => x !== pid) : [...a, pid]));

  return (
    <>
      <div className="bar">
        <h1>{g.name}</h1>
        <button className="btn alt" onClick={copy}>Copiar link</button>
      </div>
      <div className="grid2">
        <div className="col">
          <div className="card">
            <h2>Nuevo gasto</h2>
            <div className="two">
              <div><label htmlFor="d">Qué fue</label><input id="d" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Carne y carbón" maxLength={60} /></div>
              <div><label htmlFor="a">Monto</label><input id="a" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="12.500,00" /></div>
            </div>
            <label htmlFor="w">Pagó</label>
            <select id="w" value={payer} onChange={(e) => setPayer(e.target.value)}>
              {g.people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <label>Se divide entre</label>
            <div className="chips">
              {g.people.map((p) => (
                <button key={p.id} type="button" className={'chip' + (among.includes(p.id) ? ' on' : '')} onClick={() => toggle(p.id)} aria-pressed={among.includes(p.id)}>
                  <Av pid={p.id} />{p.name}
                </button>
              ))}
            </div>
            {msg && <p className="err" role="status">{msg}</p>}
            <button className="btn" onClick={add}>Guardar gasto</button>
          </div>
          <div className="card">
            <h2>Gastos {g.expenses.length > 0 && <small>· {money(total)}</small>}</h2>
            {g.expenses.length === 0 && <p className="muted">Todavía no hay nada. Cargá el primero arriba.</p>}
            {[...g.expenses].reverse().map((e) => (
              <div className="li" key={e.id}>
                <Av pid={e.payerId} />
                <div className="grow"><b>{e.desc}</b><div className="muted">Pagó {name(e.payerId)} · entre {e.among.length === g.people.length ? 'todos' : e.among.map(name).join(', ')}</div></div>
                <span className="amt">{money(e.amount)}</span>
                <button className="x" onClick={() => del(e.id)} aria-label={`Borrar ${e.desc}`}>✕</button>
              </div>
            ))}
          </div>
        </div>
        <div className="col">
          <div className="card hl">
            <h2>Para saldar</h2>
            {g.expenses.length === 0 ? <p className="muted">Cuando cargues gastos, acá aparece quién le paga a quién.</p>
              : pays.length === 0 ? <p><b>Están a mano. Nadie debe nada 🎉</b></p>
              : pays.map((t, i) => (
                <div className="li" key={i}><Av pid={t.from} /><div className="grow"><b>{name(t.from)}</b> le paga a <b>{name(t.to)}</b></div><span className="amt">{money(t.v)}</span></div>
              ))}
          </div>
          <div className="card">
            <h2>Cómo está cada uno</h2>
            {g.people.map((p) => {
              const v = bal[p.id];
              return (
                <div className="li" key={p.id}><Av pid={p.id} /><span className="grow">{p.name}</span>
                  <span className={'amt ' + (v > 0 ? 'pos' : v < 0 ? 'neg' : '')}>{v > 0 ? `+${money(v)}` : v < 0 ? `−${money(-v)}` : 'a mano'}</span></div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
