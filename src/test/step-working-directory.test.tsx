import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { WorkflowEditor } from '../components/editor/WorkflowEditor';
import { useWorkflowStore } from '../store/useWorkflowStore';

describe('step working-directory editing', () => {
  beforeEach(() => {
    act(() => {
      useWorkflowStore.getState().newWorkflow();
      const jobId = useWorkflowStore.getState().addJob('build');
      useWorkflowStore.getState().addStep(jobId, { uses: 'actions/checkout@v4' });
    });
  });

  it('exposes a working-directory input and writes it into YAML', () => {
    render(<WorkflowEditor />);

    const input = screen.getByLabelText('工作目录 Working Directory') as HTMLInputElement;
    fireEvent.change(input, { target: { value: './app' } });

    expect(useWorkflowStore.getState().yamlText).toContain('working-directory: ./app');
  });

  it('projects an imported working-directory back into the input', () => {
    act(() => {
      useWorkflowStore
        .getState()
        .importYaml(
          'jobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        working-directory: ./docs',
        );
    });
    render(<WorkflowEditor />);

    expect((screen.getByLabelText('工作目录 Working Directory') as HTMLInputElement).value).toBe(
      './docs',
    );
  });
});
