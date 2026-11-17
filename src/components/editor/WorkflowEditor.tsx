/** Workflow editor: name field, triggers and the sortable job list. */
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { LABELS, labelText } from '../../i18n/labels';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { FieldInput } from './fields/FieldInput';
import { JobCard } from './JobCard';
import { TriggerEditor } from './TriggerEditor';

export function WorkflowEditor() {
  const model = useWorkflowStore((s) => s.model);
  const setName = useWorkflowStore((s) => s.setName);
  const renameJob = useWorkflowStore((s) => s.renameJob);
  const removeJob = useWorkflowStore((s) => s.removeJob);
  const removeTrigger = useWorkflowStore((s) => s.removeTrigger);
  const updateTrigger = useWorkflowStore((s) => s.updateTrigger);
  const setJobName = useWorkflowStore((s) => s.setJobName);
  const setJobRunsOn = useWorkflowStore((s) => s.setJobRunsOn);
  const setJobIf = useWorkflowStore((s) => s.setJobIf);
  const setJobNeeds = useWorkflowStore((s) => s.setJobNeeds);
  const setJobEnv = useWorkflowStore((s) => s.setJobEnv);
  const setStrategy = useWorkflowStore((s) => s.setStrategy);
  const setStepField = useWorkflowStore((s) => s.setStepField);
  const removeStep = useWorkflowStore((s) => s.removeStep);

  const { setNodeRef, isOver } = useDroppable({ id: 'drop-workflow' });
  const allJobIds = model.jobs.map((j) => j.id);

  return (
    <div ref={setNodeRef} className={`workflow-editor${isOver ? ' workflow-editor--over' : ''}`}>
      <div className="workflow-editor__section">
        <FieldInput labelKey="name" value={model.name ?? ''} onChange={setName} />
      </div>

      <div className="workflow-editor__section">
        <TriggerEditor
          triggers={model.triggers}
          onRemove={removeTrigger}
          onUpdate={updateTrigger}
        />
      </div>

      <div className="workflow-editor__section">
        <div className="workflow-editor__heading">
          {labelText(LABELS.jobs)}
          <span className="workflow-editor__count">{model.jobs.length}</span>
        </div>
        <SortableContext items={allJobIds} strategy={verticalListSortingStrategy}>
          {model.jobs.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              index={index}
              allJobIds={allJobIds}
              onRename={(id, newId) => renameJob(id, newId)}
              onRemove={() => removeJob(job.id)}
              onField={(field, value) => {
                switch (field) {
                  case 'name':
                    setJobName(job.id, String(value));
                    break;
                  case 'runs-on':
                    setJobRunsOn(job.id, String(value));
                    break;
                  case 'if':
                    setJobIf(job.id, String(value));
                    break;
                  case 'needs':
                    setJobNeeds(job.id, value as string[]);
                    break;
                  case 'env':
                    setJobEnv(job.id, value as Record<string, string>);
                    break;
                  case 'strategy':
                    setStrategy(job.id, value);
                    break;
                }
              }}
              onStepChange={(stepIndex, field, value) =>
                setStepField(job.id, stepIndex, field, value)
              }
              onStepRemove={(stepIndex) => removeStep(job.id, stepIndex)}
            />
          ))}
        </SortableContext>
        {model.jobs.length === 0 && (
          <div className="workflow-editor__empty">{labelText(LABELS.noJobs)}</div>
        )}
      </div>
    </div>
  );
}
