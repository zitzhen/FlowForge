import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useWorkflowStore } from '../store/useWorkflowStore';

const reset = () => {
  act(() => {
    useWorkflowStore.getState().newWorkflow();
  });
};

describe('undo / redo', () => {
  beforeEach(reset);

  it('undoes and redoes a single edit', () => {
    act(() => {
      useWorkflowStore.getState().setName('First');
      useWorkflowStore.getState().setName('Second');
    });
    expect(useWorkflowStore.getState().model.name).toBe('Second');

    act(() => useWorkflowStore.getState().undo());
    expect(useWorkflowStore.getState().model.name).toBe('First');

    act(() => useWorkflowStore.getState().undo());
    expect(useWorkflowStore.getState().model.name).toBeUndefined();

    act(() => useWorkflowStore.getState().redo());
    expect(useWorkflowStore.getState().model.name).toBe('First');
  });

  it('clears the redo stack after a new edit following undo', () => {
    act(() => {
      useWorkflowStore.getState().setName('A');
      useWorkflowStore.getState().setName('B');
      useWorkflowStore.getState().undo();
    });
    expect(useWorkflowStore.getState().model.name).toBe('A');

    act(() => useWorkflowStore.getState().setName('C'));
    expect(useWorkflowStore.getState().future).toHaveLength(0);
    act(() => useWorkflowStore.getState().redo());
    expect(useWorkflowStore.getState().model.name).toBe('C');
  });

  it('keeps yamlText in sync with the restored document', () => {
    act(() => {
      useWorkflowStore.getState().addJob('build');
      useWorkflowStore.getState().setJobRunsOn('build', 'windows-latest');
      useWorkflowStore.getState().undo();
    });
    const state = useWorkflowStore.getState();
    expect(state.yamlText).not.toContain('windows-latest');
    expect(state.yamlText).toContain('build:');
  });

  it('clears history on import and newWorkflow', () => {
    act(() => {
      useWorkflowStore.getState().setName('A');
      useWorkflowStore.getState().importYaml('name: Imported\njobs: {}');
    });
    expect(useWorkflowStore.getState().past).toHaveLength(0);
    expect(useWorkflowStore.getState().future).toHaveLength(0);

    act(() => {
      useWorkflowStore.getState().setName('B');
      useWorkflowStore.getState().newWorkflow();
    });
    expect(useWorkflowStore.getState().past).toHaveLength(0);
    expect(useWorkflowStore.getState().future).toHaveLength(0);
  });

  it('does nothing when there is no history', () => {
    const before = useWorkflowStore.getState().yamlText;
    act(() => {
      useWorkflowStore.getState().undo();
      useWorkflowStore.getState().redo();
    });
    expect(useWorkflowStore.getState().yamlText).toBe(before);
  });

  it('bounds the history stack', () => {
    act(() => {
      for (let i = 0; i < 60; i++) useWorkflowStore.getState().setName(`n${i}`);
    });
    expect(useWorkflowStore.getState().past.length).toBeLessThanOrEqual(50);
  });
});
