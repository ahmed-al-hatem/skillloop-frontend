/**
 * Display-only preview of a decision: `round(P × % / 100)` to the receiver, the rest to the
 * provider. The backend computes the real numbers; its response replaces this (plan §7.2).
 */
export function previewSplit(pricePoints: number, receiverPercent: number) {
  const receiver = Math.round((pricePoints * receiverPercent) / 100);
  return { receiver, provider: pricePoints - receiver };
}
