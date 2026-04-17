import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { SnapshotPayload } from '../../hooks/useSupabaseSync'
import { SKILL_TREE, LANG_SKILL_TREE } from '../../data/skills'

const ALL_SKILLS = [...SKILL_TREE, ...LANG_SKILL_TREE]
const SKILL_META = Object.fromEntries(ALL_SKILLS.map(s => [s.id, s]))

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
    if (!input.trim() || !supabase) return
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
    <div style={{ fontFamily: 'monospace', padding: 24, maxWidth: 600, margin: '0 auto', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
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
            <p style={{ fontSize: 12, color: 'gray', margin: '0 0 12px' }}>
              Mastery 0–100 %: pod 20 % = začátečník, 20–75 % = aktivní učení (ZPD), nad 75 % = zvládnuto. Mastery bez praxe postupně klesá.
            </p>
            {ALL_SKILLS.map((meta) => {
              const skill = s.studentProgress[meta.id as keyof typeof s.studentProgress]
              if (!skill) return null
              const pct = Math.round(skill.mastery * 100)
              const locked = !skill.unlocked
              const barColor = pct >= 75 ? '#4caf50' : pct >= 20 ? '#ff9800' : '#f44336'
              const lastPracticed = skill.lastPracticed
                ? new Date(skill.lastPracticed).toLocaleDateString('cs-CZ')
                : 'nikdy'
              return (
                <div key={meta.id} style={{
                  marginBottom: 8,
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: locked ? '1px dashed #ddd' : '1px solid #ddd',
                  background: locked ? '#fafafa' : '#fff',
                  opacity: locked ? 0.55 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                    <span>{meta.icon}</span>
                    <strong style={{ fontSize: 13 }}>{meta.name}</strong>
                    <span style={{ fontSize: 10, color: '#aaa', fontFamily: 'monospace' }}>({meta.id})</span>
                    {locked && <span style={{ fontSize: 11, color: '#bbb', marginLeft: 'auto' }}>🔒 zamčeno</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: locked ? 0 : 6 }}>{meta.description}</div>
                  {!locked && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 7, background: '#eee', borderRadius: 4 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 12, minWidth: 36, textAlign: 'right' }}>{pct} %</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>
                        Naposledy: {lastPracticed} · Pokusů: {skill.attempts}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
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
