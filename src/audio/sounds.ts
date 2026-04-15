// src/audio/sounds.ts

let _muted = false

function ctx(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

function beep(frequency: number, duration: number, type: OscillatorType = 'square', volume = 0.15): void {
  if (_muted) return
  try {
    const ac = ctx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ac.currentTime)
    gain.gain.setValueAtTime(volume, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + duration)
  } catch {
    // AudioContext blocked by autoplay policy — silent fail
  }
}

export function setMuted(muted: boolean): void {
  _muted = muted
}

export function isMuted(): boolean {
  return _muted
}

export const playSound = {
  correct(): void {
    beep(660, 0.12, 'sine', 0.18)
    setTimeout(() => beep(880, 0.15, 'sine', 0.15), 80)
  },
  wrong(): void {
    beep(220, 0.2, 'square', 0.08)
  },
  combo(): void {
    beep(440, 0.08, 'sine')
    setTimeout(() => beep(554, 0.08, 'sine'), 90)
    setTimeout(() => beep(659, 0.15, 'sine'), 180)
  },
  mania(): void {
    [440, 554, 659, 880].forEach((f, i) =>
      setTimeout(() => beep(f, 0.1, 'sine', 0.2), i * 80)
    )
  },
  reward(): void {
    [523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => beep(f, 0.12, 'sine', 0.18), i * 100)
    )
  },
  unlock(): void {
    [392, 523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => beep(f, 0.1, 'sine', 0.2), i * 80)
    )
  },
  wheel(): void {
    let delay = 0
    for (let i = 0; i < 8; i++) {
      const freq = 300 + i * 40
      setTimeout(() => beep(freq, 0.06, 'square', 0.1), delay)
      delay += 60 + i * 30
    }
  },
}
