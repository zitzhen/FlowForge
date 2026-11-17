/** Custom read-only node for a workflow job. */
import { Handle, type NodeProps, Position } from '@xyflow/react';

interface JobNodeDisplayData {
  label: string;
  runsOn: string;
  stepCount: number;
  triggerSummary: string;
}

export function WorkflowNode({ data, id }: NodeProps) {
  const info = data as unknown as JobNodeDisplayData;
  const isStart = id === '__start';
  return (
    <div className={`flow-node${isStart ? ' flow-node--start' : ''}`}>
      {!isStart && <Handle type="target" position={Position.Left} />}
      <div className="flow-node__title">{info.label}</div>
      <div className="flow-node__meta">
        <span className="flow-node__badge">{info.runsOn}</span>
        <span className="flow-node__steps">
          {isStart ? info.triggerSummary : `${info.stepCount} steps`}
        </span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
