// src/hooks/useAdaptiveDifficulty.ts
// Tracking přesnosti je nyní v Zustand store (worldAccuracy).
// Tato funkce jen přepočítá rozsah čísel na základě nashromážděné přesnosti.

/** Vrátí upravený rozsah čísel podle historické přesnosti hráče ve světě.
 *  - přesnost < 60 %  → zúží rozsah na dolní polovinu (lehčí čísla)
 *  - přesnost > 90 %  → zúží rozsah na horní polovinu (těžší čísla)
 *  - jinak            → beze změny
 *  Vyžaduje alespoň 5 pokusů, jinak vrátí base beze změny.
 */
export function getAdaptedRange(
  base: [number, number],
  correct: number,
  total: number,
): [number, number] {
  if (total < 5) return base
  const [min, max] = base
  const mid = Math.ceil((min + max) / 2)
  const accuracy = correct / total

  if (accuracy < 0.6) return [min, Math.max(min + 1, mid)]
  if (accuracy > 0.9) return [Math.min(max - 1, mid), max]
  return base
}
