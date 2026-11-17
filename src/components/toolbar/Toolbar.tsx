/** Toolbar: New, Import, Export, undo/redo actions plus parse diagnostics. */
import { useEffect, useState } from 'react';
import { LABELS, labelText } from '../../i18n/labels';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { ImportDialog } from './ImportDialog';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
}

export function Toolbar() {
  const [showImport, setShowImport] = useState(false);
  const yamlText = useWorkflowStore((s) => s.yamlText);
  const errors = useWorkflowStore((s) => s.errors);
  const newWorkflow = useWorkflowStore((s) => s.newWorkflow);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const canUndo = useWorkflowStore((s) => s.past.length > 0);
  const canRedo = useWorkflowStore((s) => s.future.length > 0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

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
        <button
          type="button"
          className="btn btn--history"
          onClick={undo}
          disabled={!canUndo}
          title={`${labelText(LABELS.undo)} (Ctrl+Z)`}
          aria-label={labelText(LABELS.undo)}
        >
          ↶
        </button>
        <button
          type="button"
          className="btn btn--history"
          onClick={redo}
          disabled={!canRedo}
          title={`${labelText(LABELS.redo)} (Ctrl+Shift+Z)`}
          aria-label={labelText(LABELS.redo)}
        >
          ↷
        </button>
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
