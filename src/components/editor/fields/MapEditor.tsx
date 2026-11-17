/** Key-value editor for env/with maps. Edits line-by-line as `KEY=value`. */
import { useState } from 'react';
import type { YamlRecord } from '../../../domain/types';
import { LABELS, labelText } from '../../../i18n/labels';
import { parseValue, toValueText } from '../../../yaml/valueText';

interface MapEditorProps {
  labelKey: 'env' | 'with';
  record?: YamlRecord;
  onChange: (record: YamlRecord) => void;
}

function toLines(record?: YamlRecord): string {
  if (!record) return '';
  return Object.entries(record)
    .map(([key, value]) => `${key}=${toValueText(value)}`)
    .join('\n');
}

function fromLines(text: string): YamlRecord {
  const result: YamlRecord = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key) result[key] = parseValue(value);
  }
  return result;
}

export function MapEditor({ labelKey, record, onChange }: MapEditorProps) {
  const [text, setText] = useState(() => toLines(record));
  const [editing, setEditing] = useState(false);

  const commit = () => {
    setEditing(false);
    onChange(fromLines(text));
  };

  return (
    <div className="field">
      <span className="field__label">{labelText(LABELS[labelKey])}</span>
      {editing ? (
        <textarea
          className="field-input field-input--mono"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          placeholder="KEY=value"
        />
      ) : (
        <button type="button" className="field-summary" onClick={() => setEditing(true)}>
          {text || '—'}
        </button>
      )}
    </div>
  );
}
