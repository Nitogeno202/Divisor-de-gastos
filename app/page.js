'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [people, setPeople] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function create() {
    setErr(''); setBusy(true);
    const r = await fetch('/api/groups', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, people: people.split(/[,\n]/) }),
    });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Algo salió mal.'); setBusy(false); return; }
    router.push(`/g/${d.id}`);
  }

  return (
    <div className="grid2">
      <div className="hero">
        <h1>¿Quién puso la plata?</h1>
        <p>Armá un grupo, cargá lo que gastó cada uno y compartí el link. Sin registrarte, sin vueltas: al final te dice quién le paga a quién.</p>
        <p className="tag">Asados · viajes · alquileres · regalos</p>
      </div>
      <div className="card">
        <h2>Nuevo grupo</h2>
        <label htmlFor="n">Cómo se llama</label>
        <input id="n" value={name} onChange={(e) => setName(e.target.value)} placeholder="Asado del sábado" maxLength={60} />
        <label htmlFor="p">Quiénes son (separados por coma)</label>
        <textarea id="p" rows={3} value={people} onChange={(e) => setPeople(e.target.value)} placeholder="Lu, Tomi, Cami, Fede" />
        {err && <p className="err">{err}</p>}
        <button className="btn" onClick={create} disabled={busy}>{busy ? 'Creando…' : 'Crear grupo'}</button>
      </div>
    </div>
  );
}
