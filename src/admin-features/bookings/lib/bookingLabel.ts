/** «#B-8812» from the 🟡 `code`; the start of the id until the backend sends it. */
export const bookingLabel = (b: { id: string; code?: string }) => `#${b.code ?? b.id.slice(0, 8)}`;
