// src/components/dev/SkillDebugPanel.tsx
// Zobrazí se jen v development módu (npm run dev), v buildu zmizí.
import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { SKILL_TREE } from '../../data/skills'
import { MathSkillId } from '../../data/types'

export function SkillDebugPanel() {
  const { studentProgress, updateSkillMastery } = useGameStore()
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      position: 'fixed', bottom: 60, right: 8, zIndex: 9999,
      fontFamily: 'monospace', fontSize: 11,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#111', color: '#0f0', border: '1px solid #0f0',
          padding: '3px 8px', cursor: 'pointer', borderRadius: 3,
        }}
      >
        {open ? '✕ Skills' : '🧠 Skills'}
      </button>

      {open && (
        <div style={{
          background: '#111', border: '1px solid #333',
          padding: 8, marginTop: 4, borderRadius: 4,
          maxHeight: 340, overflowY: 'auto', width: 240,
        }}>
          {SKILL_TREE.map(skill => {
            const state = studentProgress[skill.id]
            const pct = Math.round(state.mastery * 100)
            const barColor = pct >= 70 ? '#0f0' : pct >= 30 ? '#ff0' : '#f00'
            return (
              <div key={skill.id} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: state.unlocked ? '#ccc' : '#555' }}>
                  <span>{state.unlocked ? '🔓' : '🔒'} {skill.id}</span>
                  <span style={{ color: barColor }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: '#333', marginTop: 2 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: barColor }} />
                </div>
                {state.unlocked && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                    <button onClick={() => updateSkillMastery(skill.id as MathSkillId, true)}
                      style={{ flex: 1, background: '#030', color: '#0f0', border: 'none', cursor: 'pointer', fontSize: 10, padding: '1px 0' }}>
                      +correct
                    </button>
                    <button onClick={() => updateSkillMastery(skill.id as MathSkillId, false)}
                      style={{ flex: 1, background: '#300', color: '#f00', border: 'none', cursor: 'pointer', fontSize: 10, padding: '1px 0' }}>
                      +wrong
                    </button>
                    <span style={{ color: '#555', fontSize: 10, alignSelf: 'center' }}>
                      {state.attempts}×
                    </span>
                  </div>
                )}
              </div>
            )
          })}
          <div style={{ borderTop: '1px solid #333', marginTop: 6, paddingTop: 6, color: '#555', fontSize: 10 }}>
            Tlačítka simulují odpovědi bez herní logiky
          </div>
        </div>
      )}
    </div>
  )
}
