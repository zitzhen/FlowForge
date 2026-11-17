/** Shared inline field editors used by the workflow editor. */
import { LABELS, type LabelKey, labelText } from '../../../i18n/labels';

interface FieldInputProps {
  labelKey: LabelKey;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  multiline?: boolean;
}

export function FieldInput({
  labelKey,
  value,
  onChange,
  placeholder,
  mono,
  multiline,
}: FieldInputProps) {
  const label = LABELS[labelKey];
  const shared = {
    className: `field-input${mono ? ' field-input--mono' : ''}`,
    value,
    placeholder,
    'aria-label': labelText(label),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  };
  return (
    <div className="field">
      <span className="field__label">{labelText(label)}</span>
      {multiline ? <textarea {...shared} rows={3} /> : <input {...shared} type="text" />}
    </div>
  );
}
