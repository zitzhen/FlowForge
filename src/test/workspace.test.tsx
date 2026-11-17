import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Workspace } from '../components/layout/Workspace';
import { useWorkflowStore } from '../store/useWorkflowStore';

describe('Workspace shell', () => {
  it('renders the three-column layout with bilingual headings', () => {
    act(() => {
      useWorkflowStore.getState().newWorkflow();
    });
    render(<Workspace />);
    expect(screen.getByText('积木')).toBeTruthy();
    expect(screen.getByText('编排')).toBeTruthy();
    expect(screen.getByText('流程图')).toBeTruthy();
    expect(screen.getByText('YAML', { exact: true })).toBeTruthy();
    expect(screen.getByText('Blocks')).toBeTruthy();
    expect(screen.getByText('Workflow Graph')).toBeTruthy();
  });
});
