/**
 * «#D-1042» from the 🟡 `code`; the start of the id until the backend sends one (plan §10.1).
 * Render it inside `<Ltr>` so the «#» stays in front in RTL.
 */
export function formatEntityRef(entity: { id: string; code?: string }) {
  return `#${entity.code ?? entity.id.slice(0, 8)}`;
}
