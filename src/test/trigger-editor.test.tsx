import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { WorkflowEditor } from '../components/editor/WorkflowEditor';
import { useWorkflowStore } from '../store/useWorkflowStore';

describe('trigger config editing', () => {
  beforeEach(() => {
    act(() => {
      useWorkflowStore.getState().newWorkflow();
    });
  });

  it('edits push branches and reflects them in YAML as a typed array', () => {
    act(() => {
      useWorkflowStore.getState().addTrigger('push', { branches: ['main'] });
    });
    render(<WorkflowEditor />);

    fireEvent.click(screen.getByLabelText('Toggle push config'));
    const input = screen.getByLabelText('分支 Branches') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'main, dev' } });
    fireEvent.blur(input);

    const yaml = useWorkflowStore.getState().yamlText;
    expect(yaml).toMatch(/branches:\s*\n?\s*- main/);
    expect(yaml).toContain('- dev');
  });

  it('edits schedule cron', () => {
    act(() => {
      useWorkflowStore.getState().addTrigger('schedule', { cron: '0 0 * * *' });
    });
    render(<WorkflowEditor />);

    fireEvent.click(screen.getByLabelText('Toggle schedule config'));
    const input = screen.getByLabelText('定时表达式 Cron') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '*/5 * * * *' } });
    fireEvent.blur(input);

    expect(useWorkflowStore.getState().yamlText).toContain('"*/5 * * * *"');
  });

  it('keeps unknown trigger fields when editing a known one', () => {
    act(() => {
      useWorkflowStore
        .getState()
        .importYaml('on:\n  push:\n    branches: [main]\n    custom-key: keep\njobs: {}');
    });
    render(<WorkflowEditor />);

    fireEvent.click(screen.getByLabelText('Toggle push config'));
    const input = screen.getByLabelText('分支 Branches') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'develop' } });
    fireEvent.blur(input);

    const yaml = useWorkflowStore.getState().yamlText;
    expect(yaml).toContain('custom-key: keep');
    expect(yaml).toContain('- develop');
  });
});
