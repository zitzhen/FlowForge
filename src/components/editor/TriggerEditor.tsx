/** Trigger list editor: add via palette, remove via button. */

import type { Trigger } from '../../domain/types';
import { LABELS, labelText } from '../../i18n/labels';

interface TriggerEditorProps {
  triggers: Trigger[];
  onRemove: (event: string) => void;
}

export function TriggerEditor({ triggers, onRemove }: TriggerEditorProps) {
  return (
    <div className="trigger-editor">
      <div className="trigger-editor__heading">{labelText(LABELS.triggers)}</div>
      {triggers.length === 0 ? (
        <div className="trigger-editor__empty">{labelText(LABELS.noTriggers)}</div>
      ) : (
        <div className="trigger-chips">
          {triggers.map((trigger) => (
            <span key={trigger.id} className="trigger-chip">
              {trigger.event}
              <button
                type="button"
                className="trigger-chip__remove"
                onClick={() => onRemove(trigger.event)}
                aria-label={`Remove ${trigger.event}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
