import { EditorDndContext } from '../editor/EditorDndContext';
import { WorkflowEditor } from '../editor/WorkflowEditor';
import { BlockPalette } from '../palette/BlockPalette';

export function Workspace() {
  return (
    <div className="workspace">
      <header className="workspace__toolbar">
        <div className="panel-heading">
          <span className="panel-heading__title">
            FlowForge <span className="panel-heading__en">GitHub Actions Visual Editor</span>
          </span>
        </div>
      </header>

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
            <div className="placeholder">Workflow graph will render here</div>
          </div>
          <div className="workspace__yaml">
            <div className="panel-heading">
              <span className="panel-heading__title">
                YAML <span className="panel-heading__en">Preview</span>
              </span>
            </div>
            <div className="placeholder">YAML preview will render here</div>
          </div>
        </section>
      </div>
    </div>
  );
}
