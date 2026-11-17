/** Read-only YAML preview with a copy button. */
import { useEffect, useState } from 'react';
import { LABELS, labelText } from '../../i18n/labels';
import { useWorkflowStore } from '../../store/useWorkflowStore';

export function YamlPreview() {
  const yamlText = useWorkflowStore((s) => s.yamlText);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(yamlText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="yaml-preview">
      <button type="button" className="btn btn--small yaml-preview__copy" onClick={copy}>
        {copied ? labelText(LABELS.copied) : labelText(LABELS.copy)}
      </button>
      <pre className="yaml-preview__code">{yamlText}</pre>
    </div>
  );
}
