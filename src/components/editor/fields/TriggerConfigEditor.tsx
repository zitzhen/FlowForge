/** Edit the known config fields of a trigger event. */
import { useState } from 'react';
import type { BilingualLabel, YamlRecord, YamlValue } from '../../../domain/types';
import { LABELS, labelText } from '../../../i18n/labels';
import { parseValue, toValueText } from '../../../yaml/valueText';

type FieldKind = 'list' | 'text';

interface FieldDef {
  key: string;
  label: BilingualLabel;
  kind: FieldKind;
}

const FIELD_DEFS: Record<string, FieldDef[]> = {
  push: [
    { key: 'branches', label: LABELS.branches, kind: 'list' },
    { key: 'paths', label: LABELS.paths, kind: 'list' },
  ],
  pull_request: [
    { key: 'branches', label: LABELS.branches, kind: 'list' },
    { key: 'paths', label: LABELS.paths, kind: 'list' },
  ],
  schedule: [{ key: 'cron', label: LABELS.cron, kind: 'text' }],
};

function ConfigField({
  def,
  value,
  onChange,
}: {
  def: FieldDef;
  value: YamlValue | undefined;
  onChange: (value: YamlValue) => void;
}) {
  const initial =
    def.kind === 'list' && Array.isArray(value)
      ? value.map(toValueText).join(', ')
      : toValueText(value ?? '');
  const [text, setText] = useState(initial);

  const commit = () => {
    const next: YamlValue =
      def.kind === 'list'
        ? text
            .split(',')
            .map((part) => parseValue(part.trim()))
            .filter((part) => part !== '')
        : parseValue(text);
    onChange(next);
  };

  return (
    <label className="field">
      <span className="field__label">{labelText(def.label)}</span>
      <input
        className="field-input field-input--mono"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        placeholder={def.kind === 'list' ? 'main, dev' : '0 0 * * *'}
        aria-label={labelText(def.label)}
      />
    </label>
  );
}

interface TriggerConfigEditorProps {
  event: string;
  config: YamlRecord;
  /** Receives only the changed field, so unknown keys survive untouched. */
  onChange: (patch: YamlRecord) => void;
}

export function TriggerConfigEditor({ event, config, onChange }: TriggerConfigEditorProps) {
  const fields = FIELD_DEFS[event];
  if (!fields || fields.length === 0) {
    return <div className="field-hint">{labelText(LABELS.noTriggerConfig)}</div>;
  }
  return (
    <div className="field-expand">
      {fields.map((def) => (
        <ConfigField
          key={def.key}
          def={def}
          value={config[def.key]}
          onChange={(value) => onChange({ [def.key]: value })}
        />
      ))}
    </div>
  );
}
