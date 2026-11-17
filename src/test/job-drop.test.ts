import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { resolveJobDropIndex } from '../components/editor/EditorDndContext';
import { useWorkflowStore } from '../store/useWorkflowStore';

describe('resolveJobDropIndex', () => {
  const ids = ['a', 'b', 'c'];

  it('resolves a step-drop target to the job index', () => {
    expect(resolveJobDropIndex('drop-job:b', { type: 'step-drop', jobId: 'b' }, ids)).toBe(1);
  });

  it('resolves a job sortable target', () => {
    expect(resolveJobDropIndex('c', { type: 'job' }, ids)).toBe(2);
  });

  it('falls back to parsing the id prefix', () => {
    expect(resolveJobDropIndex('drop-job:a', undefined, ids)).toBe(0);
  });

  it('returns -1 for the workflow backdrop or unknown ids', () => {
    expect(resolveJobDropIndex('drop-workflow', undefined, ids)).toBe(-1);
    expect(resolveJobDropIndex('missing', { type: 'job' }, ids)).toBe(-1);
  });
});

describe('job drop insertion', () => {
  beforeEach(() => {
    act(() => {
      useWorkflowStore.getState().newWorkflow();
    });
  });

  it('inserts a new job at the targeted index', () => {
    let a = '';
    let b = '';
    act(() => {
      const s = useWorkflowStore.getState();
      a = s.addJob('a');
      b = s.addJob('b');
    });
    const idsBefore = useWorkflowStore.getState().model.jobs.map((j) => j.id);
    const targetIndex = resolveJobDropIndex('a', { type: 'job' }, idsBefore);

    let newId = '';
    act(() => {
      newId = useWorkflowStore.getState().addJob();
      const latest = useWorkflowStore.getState().model.jobs.map((j) => j.id);
      const from = latest.indexOf(newId);
      if (targetIndex !== -1 && from !== targetIndex) {
        useWorkflowStore.getState().moveJob(from, targetIndex);
      }
    });

    expect(useWorkflowStore.getState().model.jobs.map((j) => j.id)).toEqual([newId, a, b]);
  });

  it('appends a new job when dropped on the workflow backdrop', () => {
    let a = '';
    act(() => {
      a = useWorkflowStore.getState().addJob('a');
    });
    const idsBefore = useWorkflowStore.getState().model.jobs.map((j) => j.id);
    const targetIndex = resolveJobDropIndex('drop-workflow', undefined, idsBefore);
    expect(targetIndex).toBe(-1);

    let newId = '';
    act(() => {
      newId = useWorkflowStore.getState().addJob();
    });
    expect(useWorkflowStore.getState().model.jobs.map((j) => j.id)).toEqual([a, newId]);
  });
});
