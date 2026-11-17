import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { YamlPreview } from '../components/preview/YamlPreview';
import { toFlow } from '../flow/toFlow';
import { useWorkflowStore } from '../store/useWorkflowStore';

const reset = () => {
  act(() => {
    useWorkflowStore.getState().newWorkflow();
  });
};

describe('store integration', () => {
  beforeEach(reset);

  it('reflects an added job in the model and YAML text', () => {
    let id = '';
    act(() => {
      id = useWorkflowStore.getState().addJob('build');
    });
    const state = useWorkflowStore.getState();
    expect(state.model.jobs.map((j) => j.id)).toContain(id);
    expect(state.yamlText).toContain('build:');
    expect(state.yamlText).toContain('runs-on: ubuntu-latest');
  });

  it('updates YAML text when a step is added to a job', () => {
    let jobId = '';
    act(() => {
      jobId = useWorkflowStore.getState().addJob('build');
      useWorkflowStore.getState().addStep(jobId, { uses: 'actions/checkout@v4' });
    });
    expect(useWorkflowStore.getState().yamlText).toContain('uses: actions/checkout@v4');
  });

  it('imports a document and preserves unknown fields in the YAML text', () => {
    act(() => {
      useWorkflowStore
        .getState()
        .importYaml('name: CI\ncustom: keep\njobs:\n  build:\n    runs-on: ubuntu-latest');
    });
    const state = useWorkflowStore.getState();
    expect(state.model.name).toBe('CI');
    expect(state.yamlText).toContain('custom: keep');
  });

  it('derives graph edges from needs after editing', () => {
    act(() => {
      const s = useWorkflowStore.getState();
      const a = s.addJob('a');
      const b = s.addJob('b');
      useWorkflowStore.getState().setJobNeeds(b, [a]);
    });
    const model = useWorkflowStore.getState().model;
    const { edges } = toFlow(model);
    expect(edges.map((e) => e.id)).toContain('a->b');
  });

  it('clears the workflow on newWorkflow', () => {
    act(() => {
      useWorkflowStore.getState().addJob('build');
      useWorkflowStore.getState().newWorkflow();
    });
    expect(useWorkflowStore.getState().model.jobs).toHaveLength(0);
  });

  it('reports duplicate triggers through the notice state', () => {
    let first = false;
    let second = false;
    act(() => {
      const s = useWorkflowStore.getState();
      first = s.addTrigger('push', { branches: ['main'] });
      second = s.addTrigger('push', { branches: ['dev'] });
      if (!second) useWorkflowStore.getState().setNotice('该触发器已存在 (push)');
    });
    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(useWorkflowStore.getState().notice).toBe('该触发器已存在 (push)');
  });
});

describe('YamlPreview component', () => {
  it('renders the current YAML text', () => {
    act(() => {
      useWorkflowStore.getState().importYaml('name: Preview Test\njobs: {}');
    });
    render(<YamlPreview />);
    expect(screen.getByText(/Preview Test/)).toBeTruthy();
  });
});
