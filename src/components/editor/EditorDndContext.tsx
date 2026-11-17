/** Shared DndContext for the palette and editor panes. */
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import type { BlockMeta } from '../../domain/types';
import { useWorkflowStore } from '../../store/useWorkflowStore';

interface PaletteDragData {
  type: 'palette-block';
  block: BlockMeta;
}

export function isPaletteDrag(data: unknown): data is PaletteDragData {
  return !!data && typeof data === 'object' && (data as PaletteDragData).type === 'palette-block';
}

export function EditorDndContext({ children }: { children: ReactNode }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const store = useWorkflowStore.getState();
    const activeData = active.data.current;
    const overId = String(over.id);
    const model = store.model;

    // Palette block dropped somewhere.
    if (isPaletteDrag(activeData)) {
      const { block } = activeData;
      if (block.kind === 'step') {
        const jobId = overId.startsWith('drop-job:') ? overId.slice('drop-job:'.length) : undefined;
        if (jobId) store.addStep(jobId, block.defaults);
        return;
      }
      if (block.kind === 'job') {
        store.addJob();
        return;
      }
      if (block.kind === 'trigger') {
        store.addTrigger(block.type, block.defaults);
        return;
      }
      return;
    }

    // Reordering an existing job.
    if (activeData?.type === 'job' && over.data.current?.type === 'job') {
      const from = model.jobs.findIndex((j) => j.id === active.id);
      const to = model.jobs.findIndex((j) => j.id === over.id);
      if (from !== -1 && to !== -1 && from !== to) store.moveJob(from, to);
      return;
    }

    // Reordering an existing step within its job.
    if (activeData?.type === 'step' && over.data.current?.type === 'step') {
      for (const job of model.jobs) {
        const from = job.steps.findIndex((s) => s.id === active.id);
        const to = job.steps.findIndex((s) => s.id === over.id);
        if (from !== -1 && to !== -1 && from !== to) {
          store.moveStep(job.id, from, to);
          return;
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
}
