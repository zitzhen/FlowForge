/** A single step row, sortable within its job. */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Step } from '../../domain/types';
import { LABELS, labelText } from '../../i18n/labels';
import { FieldInput } from './fields/FieldInput';
import { MapEditor } from './fields/MapEditor';

interface StepRowProps {
  jobId: string;
  step: Step;
  index: number;
  onChange: (field: string, value: unknown) => void;
  onRemove: () => void;
}

export function StepRow({ step, index, onChange, onRemove }: StepRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
    data: { type: 'step' },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="step-row">
      <div className="step-row__header">
        <button
          type="button"
          className="drag-handle"
          {...attributes}
          {...listeners}
          aria-label="Drag step"
        >
          ⠿
        </button>
        <span className="step-row__index">{index + 1}</span>
        <span className="step-row__title">
          {step.name || step.uses || step.run || labelText(LABELS.step)}
        </span>
        <button type="button" className="btn btn--icon" onClick={onRemove} aria-label="Remove step">
          ×
        </button>
      </div>
      <div className="step-row__body">
        <FieldInput labelKey="name" value={step.name ?? ''} onChange={(v) => onChange('name', v)} />
        <FieldInput
          labelKey="uses"
          value={step.uses ?? ''}
          onChange={(v) => onChange('uses', v)}
          mono
        />
        <FieldInput
          labelKey="run"
          value={step.run ?? ''}
          onChange={(v) => onChange('run', v)}
          mono
          multiline
        />
        <FieldInput labelKey="if" value={step.if ?? ''} onChange={(v) => onChange('if', v)} mono />
        <MapEditor labelKey="with" record={step.with} onChange={(v) => onChange('with', v)} />
        <MapEditor labelKey="env" record={step.env} onChange={(v) => onChange('env', v)} />
      </div>
    </div>
  );
}
