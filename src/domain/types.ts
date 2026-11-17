/**
 * Domain model for GitHub Actions workflows.
 *
 * The model is a read-only projection of a yaml.Document. Every edit is
 * expressed as a command against known YAML paths (see yaml/applyModel.ts),
 * so unknown fields and comments in the source document are never rewritten.
 */

export type YamlScalar = string | number | boolean | null;
export type YamlValue = YamlScalar | YamlValue[] | { [key: string]: YamlValue };
export type YamlRecord = Record<string, YamlValue>;

export interface Trigger {
  /** Stable UI id; never written to YAML. */
  id: string;
  /** Event key under `on`, e.g. push, pull_request, workflow_dispatch. */
  event: string;
  /** Known configuration for the event; unknown keys stay in the Document. */
  config: YamlRecord;
}

export interface Strategy {
  /** Treated as an opaque object and preserved as-is. */
  matrix?: YamlRecord;
  failFast?: boolean;
  maxParallel?: number;
}

export interface Step {
  /** Stable UI id; never written to YAML. */
  id: string;
  name?: string;
  uses?: string;
  with?: YamlRecord;
  run?: string;
  env?: YamlRecord;
  if?: string;
  workingDirectory?: string;
}

export interface Job {
  /** The job key used in YAML: jobs.<id>. */
  id: string;
  name?: string;
  runsOn?: string | string[];
  /** Job ids this job depends on. */
  needs: string[];
  steps: Step[];
  strategy?: Strategy;
  env?: YamlRecord;
  if?: string;
}

export interface Workflow {
  name?: string;
  /** Projected from the `on` key of the document. */
  triggers: Trigger[];
  /** Array order determines YAML key order. */
  jobs: Job[];
}

export type BlockKind = 'trigger' | 'job' | 'step';
export type BlockScope = 'workflow' | 'job';

export interface BilingualLabel {
  zh: string;
  en: string;
}

export interface BlockMeta {
  kind: BlockKind;
  /** Identifies the block type, e.g. push, checkout, setup-node, run. */
  type: string;
  label: BilingualLabel;
  description?: BilingualLabel;
  /** Where the block can be dropped. */
  scope: BlockScope;
  /** Known field values written when the block is added. */
  defaults: YamlRecord;
}
