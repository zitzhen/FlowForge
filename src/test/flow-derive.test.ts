import { describe, expect, it } from 'vitest';
import type { Workflow } from '../domain/types';
import { toFlow } from '../flow/toFlow';

const workflow: Workflow = {
  name: 'CI',
  triggers: [{ id: 't1', event: 'push', config: {} }],
  jobs: [
    { id: 'build', needs: [], steps: [{ id: 's1', run: 'npm test' }], runsOn: 'ubuntu-latest' },
    { id: 'test', needs: ['build'], steps: [], runsOn: 'ubuntu-latest' },
    { id: 'deploy', needs: ['test'], steps: [], runsOn: 'ubuntu-latest' },
  ],
};

describe('toFlow', () => {
  it('creates a start node plus one node per job', () => {
    const { nodes } = toFlow(workflow);
    expect(nodes).toHaveLength(4);
    expect(nodes[0]?.id).toBe('__start');
    expect(nodes.map((n) => n.id)).toContain('build');
  });

  it('layers jobs by dependency depth', () => {
    const { nodes } = toFlow(workflow);
    const at = (id: string) => nodes.find((n) => n.id === id)?.position.x ?? 0;
    expect(at('build')).toBeLessThan(at('test'));
    expect(at('test')).toBeLessThan(at('deploy'));
  });

  it('creates edges for needs and from start to root jobs', () => {
    const { edges } = toFlow(workflow);
    const ids = edges.map((e) => e.id);
    expect(ids).toContain('build->test');
    expect(ids).toContain('test->deploy');
    expect(ids).toContain('__start->build');
    expect(ids).not.toContain('__start->test');
  });

  it('handles an empty workflow without crashing', () => {
    const { nodes, edges } = toFlow({ triggers: [], jobs: [] });
    expect(nodes).toHaveLength(1);
    expect(edges).toHaveLength(0);
  });
});
