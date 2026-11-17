/** Read-only live workflow graph preview. */

import { Background, Controls, MiniMap, type NodeTypes, ReactFlow } from '@xyflow/react';
import { useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import { toFlow } from '../../flow/toFlow';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { WorkflowNode } from './WorkflowNode';

const nodeTypes: NodeTypes = { workflowNode: WorkflowNode };

export function FlowPreview() {
  const model = useWorkflowStore((s) => s.model);
  const { nodes, edges } = useMemo(() => toFlow(model), [model]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll
    >
      <Background />
      <Controls showInteractive={false} />
      <MiniMap pannable zoomable />
    </ReactFlow>
  );
}
