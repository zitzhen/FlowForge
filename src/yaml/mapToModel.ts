/** Project the known subset of a yaml.Document into the Workflow view model. */
import { type Document, isMap, isSeq } from 'yaml';
import { createId } from '../domain/ids';
import type {
  Job,
  Step,
  Strategy,
  Trigger,
  Workflow,
  YamlRecord,
  YamlValue,
} from '../domain/types';
import { getIn, orderedKeys, PATHS } from './paths';

function asRecord(value: unknown): YamlRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as YamlRecord;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  if (typeof value === 'string') return [value];
  return [];
}

function projectTrigger(event: string, config: unknown): Trigger {
  return {
    id: createId('trigger'),
    event,
    config: asRecord(config),
  };
}

/**
 * `on` can be a map of events or a list of event names in GitHub Actions.
 * Normalize both shapes into a trigger list.
 */
function projectTriggers(doc: Document): Trigger[] {
  const value = getIn(doc, PATHS.on);
  if (value === undefined || value === null) return [];

  if (Array.isArray(value)) {
    return value
      .filter((v): v is string => typeof v === 'string')
      .map((event) => projectTrigger(event, {}));
  }

  if (typeof value === 'string') return [projectTrigger(value, {})];

  if (typeof value === 'object') {
    return orderedKeys(doc, PATHS.on).map((event) =>
      projectTrigger(event, asRecord((value as YamlRecord)[event])),
    );
  }

  return [];
}

function projectStrategy(value: unknown): Strategy | undefined {
  const record = asRecord(value);
  if (Object.keys(record).length === 0) return undefined;
  const strategy: Strategy = {};
  if (record.matrix && typeof record.matrix === 'object') {
    strategy.matrix = record.matrix as YamlRecord;
  }
  if (typeof record['fail-fast'] === 'boolean') strategy.failFast = record['fail-fast'];
  if (typeof record['max-parallel'] === 'number') strategy.maxParallel = record['max-parallel'];
  return strategy;
}

function projectStep(id: string, value: unknown): Step {
  const record = asRecord(value);
  const step: Step = { id };
  if (typeof record.name === 'string') step.name = record.name;
  if (typeof record.uses === 'string') step.uses = record.uses;
  if (typeof record.run === 'string') step.run = record.run;
  if (typeof record.if === 'string') step.if = record.if;
  if (typeof record['working-directory'] === 'string') {
    step.workingDirectory = record['working-directory'];
  }
  if (record.with && typeof record.with === 'object') step.with = asRecord(record.with);
  if (record.env && typeof record.env === 'object') step.env = asRecord(record.env);
  return step;
}

function projectJob(id: string, value: unknown): Job {
  const record = asRecord(value);
  const job: Job = {
    id,
    needs: asStringArray(record.needs),
    steps: [],
  };
  if (typeof record.name === 'string') job.name = record.name;
  const runsOn = record['runs-on'];
  if (typeof runsOn === 'string' || Array.isArray(runsOn)) {
    job.runsOn = runsOn as string | string[];
  }
  if (typeof record.if === 'string') job.if = record.if;
  if (record.env && typeof record.env === 'object') job.env = asRecord(record.env);
  const strategy = projectStrategy(record.strategy);
  if (strategy) job.strategy = strategy;

  const stepsValue = record.steps;
  if (Array.isArray(stepsValue)) {
    job.steps = stepsValue.map((raw, index) => projectStep(createId('step'), raw ?? index));
  }

  return job;
}

/** Project a Document into a Workflow model. Purely read-only. */
export function mapToModel(doc: Document): Workflow {
  const name = getIn(doc, PATHS.name);
  const triggers = projectTriggers(doc);

  let jobs: Job[] = [];
  const jobsNode = doc.getIn(PATHS.jobs, true);
  if (isMap(jobsNode)) {
    jobs = orderedKeys(doc, PATHS.jobs).map((id) => projectJob(id, getIn(doc, PATHS.job(id))));
  }

  return {
    name: typeof name === 'string' ? name : undefined,
    triggers,
    jobs,
  };
}

/** Return true when the document has a `jobs` map. */
export function hasJobs(doc: Document): boolean {
  const node = doc.getIn(PATHS.jobs, true);
  return isMap(node);
}

/** Return true when the document has an `on` key. */
export function hasTriggers(doc: Document): boolean {
  const node = doc.getIn(PATHS.on, true);
  return isMap(node) || isSeq(node);
}

export type { YamlValue };
