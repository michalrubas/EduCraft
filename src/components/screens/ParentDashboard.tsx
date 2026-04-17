import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { SnapshotPayload } from '../../hooks/useSupabaseSync'

const PARENT_CHILD_ID_KEY = 'educraft-parent-child-id'

type RowData = {
  snapshot: SnapshotPayload
  synced_at: string
}

export default function ParentDashboard() {
  const [input, setInput] = useState(
    () => localStorage.getItem(PARENT_CHILD_ID_KEY) ?? ''
  )
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [row, setRow] = useState<RowData | null>(null)

  async function load() {
    if (!input.trim()) return
    setStatus('loading')
    const { data, error } = await supabase
      .from('child_snapshots')
      .select('snapshot, synced_at')
      .eq('child_id', input.trim())
      .order('synced_at', { ascending: false })
      .limit(1)

    if (error || !data?.length) {
      setStatus('error')
      return
    }

    localStorage.setItem(PARENT_CHILD_ID_KEY, input.trim())
    setRow(data[0] as RowData)
    setStatus('loaded')
  }

  const s = row?.snapshot

  return (
    <div style={{ fontFamily: 'monospace', padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>Rodičovský dashboard</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Child ID"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          style={{ flex: 1, padding: 8, fontSize: 14 }}
        />
        <button onClick={load} disabled={status === 'loading'} style={{ padding: '8px 16px' }}>
          Načíst
        </button>
      </div>

      {status === 'loading' && <p>Načítám...</p>}

      {status === 'error' && (
        <p style={{ color: 'red' }}>ID nenalezeno nebo chyba připojení.</p>
      )}

      {status === 'loaded' && s && (
        <div>
          <div style={{ color: 'gray', fontSize: 12, marginBottom: 8 }}>
            Poslední sync: {new Date(row!.synced_at).toLocaleString('cs-CZ')}
            {' '}
            <button onClick={load} style={{ fontSize: 12, padding: '2px 8px' }}>↻ Obnovit</button>
          </div>

          <section>
            <h2>Postup</h2>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                <tr><td>Level</td><td>{s.level}</td></tr>
                <tr><td>XP</td><td>{s.xp}</td></tr>
                <tr><td>Max combo</td><td>{s.maxCombo}</td></tr>
                <tr><td>Správně celkem</td><td>{s.totalCorrect} / {s.totalAttempts}</td></tr>
                <tr><td>Přesnost</td><td>{s.totalAttempts > 0 ? Math.round(s.totalCorrect / s.totalAttempts * 100) : 0} %</td></tr>
                <tr><td>Sezení</td><td>{s.sessionsPlayed}</td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>Měna & předměty</h2>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                <tr><td>💰 Diamanty</td><td>{s.diamonds}</td></tr>
                <tr><td>💎 Smaragdy</td><td>{s.emeralds}</td></tr>
                <tr><td>⬛ Hvězdy</td><td>{s.stars}</td></tr>
                <tr><td>Vlastněné předměty</td><td>{s.ownedItems?.length ?? 0}</td></tr>
                <tr><td>Odznaky</td><td>{s.unlockedBadges.length}</td></tr>
                <tr><td>Odemčené světy</td><td>{s.unlockedWorlds.join(', ')}</td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>Dovednosti</h2>
            {Object.entries(s.studentProgress).map(([skillId, skill]) => (
              <div key={skillId} style={{ marginBottom: 6 }}>
                <span style={{ display: 'inline-block', width: 200, fontSize: 13 }}>{skillId}</span>
                <span style={{ display: 'inline-block', width: 60, fontSize: 13 }}>
                  {Math.round(skill.mastery * 100)} %
                </span>
                <div style={{ display: 'inline-block', width: 120, height: 8, background: '#eee', borderRadius: 4 }}>
                  <div style={{ width: `${skill.mastery * 100}%`, height: '100%', background: skill.mastery > 0.75 ? '#4caf50' : skill.mastery > 0.2 ? '#ff9800' : '#f44336', borderRadius: 4 }} />
                </div>
                {!skill.unlocked && <span style={{ fontSize: 11, color: '#aaa', marginLeft: 8 }}>🔒</span>}
              </div>
            ))}
          </section>

          <section>
            <h2>Přesnost per svět</h2>
            {Object.entries(s.worldAccuracy).map(([worldId, acc]) => (
              <div key={worldId} style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>{worldId}</strong>: {acc.correct} / {acc.total} ({acc.total > 0 ? Math.round(acc.correct / acc.total * 100) : 0} %)
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  )
}
