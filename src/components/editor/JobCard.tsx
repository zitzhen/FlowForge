/** A job card with sortable steps and a drop target for step blocks. */
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Job } from '../../domain/types';
import { LABELS, labelText } from '../../i18n/labels';
import { FieldInput } from './fields/FieldInput';
import { MapEditor } from './fields/MapEditor';
import { NeedsField } from './fields/NeedsField';
import { StrategyEditor } from './fields/StrategyEditor';
import { StepRow } from './StepRow';

interface JobCardProps {
  job: Job;
  index: number;
  allJobIds: string[];
  onRename: (id: string, newId: string) => void;
  onRemove: () => void;
  onField: (field: string, value: unknown) => void;
  onStepChange: (index: number, field: string, value: unknown) => void;
  onStepRemove: (index: number) => void;
}

export function JobCard({
  job,
  index,
  allJobIds,
  onRename,
  onRemove,
  onField,
  onStepChange,
  onStepRemove,
}: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver: isJobOver,
  } = useSortable({
    id: job.id,
    data: { type: 'job' },
  });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-job:${job.id}`,
    data: { type: 'step-drop', jobId: job.id },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`job-card${isOver ? ' job-card--over' : ''}${isJobOver ? ' job-card--drop' : ''}`}
    >
      {isJobOver && <div className="job-card__drop-line" />}
      <div className="job-card__header">
        <button
          type="button"
          className="drag-handle"
          {...attributes}
          {...listeners}
          aria-label="Drag job"
        >
          ⠿
        </button>
        <span className="job-card__index">{index + 1}</span>
        <input
          className="job-card__id"
          value={job.id}
          onChange={(e) => onRename(job.id, e.target.value)}
          aria-label="Job id"
        />
        <span className="job-card__en">{labelText(LABELS.job)}</span>
        <button type="button" className="btn btn--icon" onClick={onRemove} aria-label="Remove job">
          ×
        </button>
      </div>
      <div className="job-card__body">
        <FieldInput labelKey="name" value={job.name ?? ''} onChange={(v) => onField('name', v)} />
        <FieldInput
          labelKey="runsOn"
          value={typeof job.runsOn === 'string' ? job.runsOn : (job.runsOn?.join(', ') ?? '')}
          onChange={(v) => onField('runs-on', v)}
          mono
        />
        <FieldInput labelKey="if" value={job.if ?? ''} onChange={(v) => onField('if', v)} mono />
        <NeedsField
          value={job.needs}
          candidates={allJobIds}
          currentJobId={job.id}
          onChange={(v) => onField('needs', v)}
        />
        <MapEditor labelKey="env" record={job.env} onChange={(v) => onField('env', v)} />
        <StrategyEditor strategy={job.strategy} onChange={(v) => onField('strategy', v)} />
      </div>
      <div ref={setDropRef} className="step-list">
        <div className="step-list__heading">{labelText(LABELS.steps)}</div>
        <SortableContext items={job.steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {job.steps.map((step, i) => (
            <StepRow
              key={step.id}
              jobId={job.id}
              step={step}
              index={i}
              onChange={(field, value) => onStepChange(i, field, value)}
              onRemove={() => onStepRemove(i)}
            />
          ))}
        </SortableContext>
        {job.steps.length === 0 && (
          <div className="step-list__empty">{labelText(LABELS.dropStepHere)}</div>
        )}
      </div>
    </div>
  );
}
