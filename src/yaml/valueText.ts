/** Convert between KEY=value editor text and typed YAML values. */
import type { YamlValue } from '../domain/types';

/** Parse one value literal: JSON types survive, anything else stays a string. */
export function parseValue(text: string): YamlValue {
  const trimmed = text.trim();
  if (trimmed === '') return '';
  try {
    return JSON.parse(trimmed) as YamlValue;
  } catch {
    return text;
  }
}

/** Serialize a typed value back to editable KEY=value text. */
export function toValueText(value: YamlValue): string {
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
