/** Derive React Flow nodes and edges from the workflow model. */
import { type Edge, MarkerType, type Node } from '@xyflow/react';
import type { Job, Workflow } from '../domain/types';

export interface JobNodeData extends Record<string, unknown> {
  label: string;
  runsOn: string;
  stepCount: number;
  triggerSummary: string;
}

export type WorkflowFlowNode = Node<JobNodeData, 'workflowNode'>;

const START_ID = '__start';
const NODE_WIDTH = 260;
const NODE_HEIGHT = 110;
const LAYER_GAP = 300;
const ROW_GAP = 140;

/** Compute topological depth of each job from its needs graph. */
function computeDepths(jobs: Job[]): Map<string, number> {
  const byId = new Map(jobs.map((job) => [job.id, job]));
  const depths = new Map<string, number>();
  const visiting = new Set<string>();

  const depthOf = (id: string): number => {
    const cached = depths.get(id);
    if (cached !== undefined) return cached;
    if (visiting.has(id)) return 0; // cycle guard
    visiting.add(id);
    const job = byId.get(id);
    const needs = job?.needs.filter((n) => byId.has(n)) ?? [];
    const depth = needs.length === 0 ? 0 : Math.max(...needs.map(depthOf)) + 1;
    visiting.delete(id);
    depths.set(id, depth);
    return depth;
  };

  for (const job of jobs) depthOf(job.id);
  return depths;
}

/** Derive nodes and edges. Jobs are laid out in layers by dependency depth. */
export function toFlow(workflow: Workflow): { nodes: WorkflowFlowNode[]; edges: Edge[] } {
  const depths = computeDepths(workflow.jobs);
  const triggerSummary = workflow.triggers.map((t) => t.event).join(', ') || '—';

  const layerCounts = new Map<number, number>();
  const nodes: WorkflowFlowNode[] = workflow.jobs.map((job) => {
    const depth = depths.get(job.id) ?? 0;
    const row = layerCounts.get(depth) ?? 0;
    layerCounts.set(depth, row + 1);
    return {
      id: job.id,
      type: 'workflowNode',
      position: { x: 60 + depth * LAYER_GAP, y: 80 + row * ROW_GAP },
      data: {
        label: job.name || job.id,
        runsOn: typeof job.runsOn === 'string' ? job.runsOn : (job.runsOn?.join(', ') ?? '—'),
        stepCount: job.steps.length,
        triggerSummary,
      },
      draggable: false,
      connectable: false,
    };
  });

  const edges: Edge[] = [];
  for (const job of workflow.jobs) {
    for (const need of job.needs) {
      if (!depths.has(need)) continue;
      edges.push({
        id: `${need}->${job.id}`,
        source: need,
        target: job.id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }
  }

  // A synthetic start node connected to every root job.
  nodes.unshift({
    id: START_ID,
    type: 'workflowNode',
    position: { x: 60, y: 20 },
    data: {
      label: '触发器 Trigger',
      runsOn: '—',
      stepCount: 0,
      triggerSummary,
    },
    draggable: false,
    connectable: false,
  });
  for (const job of workflow.jobs) {
    if ((depths.get(job.id) ?? 0) === 0) {
      edges.unshift({
        id: `${START_ID}->${job.id}`,
        source: START_ID,
        target: job.id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }
  }

  return { nodes, edges };
}

export const FLOW_NODE_TYPES = { workflowNode: 'workflowNode' };
export { NODE_HEIGHT, NODE_WIDTH };
