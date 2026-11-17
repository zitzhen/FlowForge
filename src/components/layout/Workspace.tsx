import { useEffect } from 'react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { EditorDndContext } from '../editor/EditorDndContext';
import { WorkflowEditor } from '../editor/WorkflowEditor';
import { BlockPalette } from '../palette/BlockPalette';
import { FlowPreview } from '../preview/FlowPreview';
import { YamlPreview } from '../preview/YamlPreview';
import { Toolbar } from '../toolbar/Toolbar';

function Notice() {
  const notice = useWorkflowStore((s) => s.notice);
  const setNotice = useWorkflowStore((s) => s.setNotice);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice, setNotice]);

  if (!notice) return null;
  return (
    <div className="workspace__notice" role="status">
      {notice}
    </div>
  );
}

export function Workspace() {
  return (
    <div className="workspace">
      <header className="workspace__toolbar">
        <Toolbar />
      </header>
      <Notice />

      <div className="workspace__body">
        <EditorDndContext>
          <section className="workspace__editor-column">
            <div className="workspace__palette">
              <div className="panel-heading">
                <span className="panel-heading__title">
                  积木 <span className="panel-heading__en">Blocks</span>
                </span>
              </div>
              <BlockPalette />
            </div>
            <div className="workspace__editor">
              <div className="panel-heading">
                <span className="panel-heading__title">
                  编排 <span className="panel-heading__en">Editor</span>
                </span>
              </div>
              <WorkflowEditor />
            </div>
          </section>
        </EditorDndContext>

        <section className="workspace__preview-column">
          <div className="workspace__flow">
            <div className="panel-heading">
              <span className="panel-heading__title">
                流程图 <span className="panel-heading__en">Workflow Graph</span>
              </span>
            </div>
            <FlowPreview />
          </div>
          <div className="workspace__yaml">
            <div className="panel-heading">
              <span className="panel-heading__title">
                YAML <span className="panel-heading__en">Preview</span>
              </span>
            </div>
            <YamlPreview />
          </div>
        </section>
      </div>
    </div>
  );
}
