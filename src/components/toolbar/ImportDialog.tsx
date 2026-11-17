/** Import dialog: paste YAML text or choose a local file. */
import { useRef, useState } from 'react';
import { LABELS, labelText } from '../../i18n/labels';
import { useWorkflowStore } from '../../store/useWorkflowStore';

interface ImportDialogProps {
  onClose: () => void;
}

export function ImportDialog({ onClose }: ImportDialogProps) {
  const [text, setText] = useState('');
  const importYaml = useWorkflowStore((s) => s.importYaml);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    const content = await file.text();
    setText(content);
  };

  const confirm = () => {
    importYaml(text);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={labelText(LABELS.importTitle)}
      >
        <div className="modal__header">{labelText(LABELS.importTitle)}</div>
        <div className="modal__body">
          <p className="modal__hint">{labelText(LABELS.importHint)}</p>
          <input
            ref={fileRef}
            type="file"
            accept=".yml,.yaml,text/yaml,text/plain"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <textarea
            className="field-input field-input--mono modal__textarea"
            rows={14}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="name: CI&#10;on: push&#10;jobs: {}"
            aria-label="YAML text"
          />
        </div>
        <div className="modal__footer">
          <button type="button" className="btn" onClick={onClose}>
            {labelText(LABELS.cancel)}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={confirm}
            disabled={!text.trim()}
          >
            {labelText(LABELS.confirm)}
          </button>
        </div>
      </div>
    </div>
  );
}
