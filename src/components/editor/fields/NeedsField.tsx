/** Needs multi-select. Candidates are the other jobs in the workflow. */
import { LABELS, labelText } from '../../../i18n/labels';

interface NeedsFieldProps {
  value: string[];
  candidates: string[];
  currentJobId: string;
  onChange: (needs: string[]) => void;
}

export function NeedsField({ value, candidates, currentJobId, onChange }: NeedsFieldProps) {
  const others = candidates.filter((id) => id !== currentJobId);
  return (
    <div className="field">
      <span className="field__label">{labelText(LABELS.needs)}</span>
      <div className="needs-options">
        {others.length === 0 ? (
          <span className="field-hint">—</span>
        ) : (
          others.map((id) => {
            const checked = value.includes(id);
            return (
              <label key={id} className="needs-option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange(checked ? value.filter((v) => v !== id) : [...value, id])
                  }
                />
                <span>{id}</span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
