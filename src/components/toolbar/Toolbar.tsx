/** Toolbar: New, Import and Export actions plus parse diagnostics. */
import { useState } from 'react';
import { LABELS, labelText } from '../../i18n/labels';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { ImportDialog } from './ImportDialog';

export function Toolbar() {
  const [showImport, setShowImport] = useState(false);
  const yamlText = useWorkflowStore((s) => s.yamlText);
  const errors = useWorkflowStore((s) => s.errors);
  const newWorkflow = useWorkflowStore((s) => s.newWorkflow);

  const exportFile = () => {
    const blob = new Blob([yamlText], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.yml';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="workspace__toolbar-inner">
      <div className="toolbar__brand">
        <span className="toolbar__logo">FlowForge</span>
        <span className="toolbar__tagline">GitHub Actions Visual Editor · 可视化编排</span>
      </div>
      <div className="toolbar__actions">
        <button type="button" className="btn" onClick={newWorkflow}>
          + {labelText(LABELS.newWorkflow)}
        </button>
        <button type="button" className="btn" onClick={() => setShowImport(true)}>
          {labelText(LABELS.import)}
        </button>
        <button type="button" className="btn btn--primary" onClick={exportFile}>
          {labelText(LABELS.export)}
        </button>
      </div>
      {errors.length > 0 && (
        <div className="toolbar__errors" title={errors.join('\n')}>
          ⚠ {labelText(LABELS.parseErrors)} ({errors.length})
        </div>
      )}
      {showImport && <ImportDialog onClose={() => setShowImport(false)} />}
    </div>
  );
}
