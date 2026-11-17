/** Trigger list editor: add via palette, edit config inline, remove via button. */
import { useState } from 'react';
import type { Trigger, YamlRecord } from '../../domain/types';
import { LABELS, labelText } from '../../i18n/labels';
import { TriggerConfigEditor } from './fields/TriggerConfigEditor';

interface TriggerEditorProps {
  triggers: Trigger[];
  onRemove: (event: string) => void;
  onUpdate: (event: string, config: YamlRecord) => void;
}

export function TriggerEditor({ triggers, onRemove, onUpdate }: TriggerEditorProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="trigger-editor">
      <div className="trigger-editor__heading">{labelText(LABELS.triggers)}</div>
      {triggers.length === 0 ? (
        <div className="trigger-editor__empty">{labelText(LABELS.noTriggers)}</div>
      ) : (
        <div className="trigger-chips">
          {triggers.map((trigger) => {
            const isOpen = expanded === trigger.id;
            return (
              <div key={trigger.id} className="trigger-pill">
                <div className="trigger-chip">
                  <button
                    type="button"
                    className="trigger-chip__toggle"
                    onClick={() => setExpanded(isOpen ? null : trigger.id)}
                    aria-label={`Toggle ${trigger.event} config`}
                  >
                    {trigger.event}
                  </button>
                  <button
                    type="button"
                    className="trigger-chip__remove"
                    onClick={() => onRemove(trigger.event)}
                    aria-label={`Remove ${trigger.event}`}
                  >
                    ×
                  </button>
                </div>
                {isOpen && (
                  <TriggerConfigEditor
                    event={trigger.event}
                    config={trigger.config}
                    onChange={(patch) => onUpdate(trigger.event, patch)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
