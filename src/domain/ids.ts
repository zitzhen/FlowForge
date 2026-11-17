/** Stable id helpers for UI-only identifiers. */

/**
 * Generate a short stable id used to track UI elements (triggers, steps).
 * Uses the browser's crypto.randomUUID; jsdom and modern browsers provide it.
 */
export function createId(prefix = 'id'): string {
  const uuid = globalThis.crypto.randomUUID();
  return `${prefix}-${uuid.slice(0, 8)}`;
}
