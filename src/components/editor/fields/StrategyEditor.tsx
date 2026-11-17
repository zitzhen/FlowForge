/** Strategy editor. Matrix is treated as an opaque key-value object. */
import { useState } from 'react';
import type { Strategy, YamlRecord } from '../../../domain/types';
import { LABELS, labelText } from '../../../i18n/labels';

interface StrategyEditorProps {
  strategy?: Strategy;
  onChange: (strategy?: Strategy) => void;
}

function matrixToText(matrix?: YamlRecord): string {
  if (!matrix) return '';
  return Object.entries(matrix)
    .map(([key, values]) => `${key}=${Array.isArray(values) ? values.join(',') : String(values)}`)
    .join('\n');
}

function textToMatrix(text: string): YamlRecord {
  const result: YamlRecord = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const raw = trimmed.slice(eq + 1).trim();
    if (!key) continue;
    const parts = raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    result[key] = parts.length > 1 ? parts : raw;
  }
  return result;
}

export function StrategyEditor({ strategy, onChange }: StrategyEditorProps) {
  const [open, setOpen] = useState(false);
  const [matrixText, setMatrixText] = useState(() => matrixToText(strategy?.matrix));
  const hasStrategy = strategy !== undefined;

  const commitMatrix = () => {
    const matrix = textToMatrix(matrixText);
    const next: Strategy = { ...strategy, matrix };
    onChange(Object.keys(matrix).length > 0 ? next : undefined);
  };

  return (
    <div className="field">
      <button type="button" className="field-summary" onClick={() => setOpen(!open)}>
        {labelText(LABELS.strategy)} {hasStrategy ? '✓' : '—'}
      </button>
      {open && (
        <div className="field-expand">
          <label className="field">
            <span className="field__label">Matrix</span>
            <textarea
              className="field-input field-input--mono"
              rows={3}
              value={matrixText}
              onChange={(e) => setMatrixText(e.target.value)}
              onBlur={commitMatrix}
              placeholder="node=18,20,22"
            />
          </label>
          <label className="field-inline">
            <input
              type="checkbox"
              checked={strategy?.failFast ?? false}
              onChange={(e) => onChange({ ...strategy, failFast: e.target.checked })}
            />
            <span>fail-fast</span>
          </label>
          <button type="button" className="btn btn--small" onClick={() => onChange(undefined)}>
            {labelText(LABELS.remove)}
          </button>
        </div>
      )}
    </div>
  );
}
