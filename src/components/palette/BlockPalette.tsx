/** Block palette: draggable building blocks grouped by kind. */
import { useDraggable } from '@dnd-kit/core';
import { BLOCKS } from '../../domain/blocks';
import type { BlockMeta } from '../../domain/types';
import { LABELS, labelText } from '../../i18n/labels';

function PaletteItem({ block }: { block: BlockMeta }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${block.kind}:${block.type}`,
    data: { type: 'palette-block', block },
  });
  return (
    <div
      ref={setNodeRef}
      className={`palette-item${isDragging ? ' palette-item--dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <span className="palette-item__label">{block.label.zh}</span>
      <span className="palette-item__en">{block.label.en}</span>
      {block.description && <span className="palette-item__desc">{block.description.zh}</span>}
    </div>
  );
}

const GROUP_LABELS = {
  trigger: LABELS.triggers,
  job: LABELS.jobs,
  step: LABELS.steps,
} as const;

export function BlockPalette() {
  return (
    <div className="block-palette">
      {(['trigger', 'job', 'step'] as const).map((kind) => {
        const blocks = BLOCKS.filter((b) => b.kind === kind);
        return (
          <div key={kind} className="block-palette__group">
            <div className="block-palette__heading">{labelText(GROUP_LABELS[kind])}</div>
            <div className="block-palette__items">
              {blocks.map((block) => (
                <PaletteItem key={`${kind}:${block.type}`} block={block} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
