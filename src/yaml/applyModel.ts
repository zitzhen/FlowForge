/**
 * Editing commands that mutate only known YAML paths.
 * Unknown fields and comments in the source document are preserved.
 */
import { type Document, isMap, isSeq, type YAMLMap, type YAMLSeq } from 'yaml';
import { createId } from '../domain/ids';
import type { Job, Step, Workflow, YamlRecord } from '../domain/types';
import {
  deleteKnown,
  ensureMap,
  getIn,
  nodeValue,
  PATHS,
  type Path,
  reorderMap,
  reorderSeq,
  setKnown,
} from './paths';

/** Write the workflow name. */
export function setName(doc: Document, name: string): void {
  if (name.trim() === '') deleteKnown(doc, PATHS.name);
  else setKnown(doc, PATHS.name, name);
}

function createEmptyJobsMap(doc: Document): void {
  if (!doc.getIn(PATHS.jobs, true)) setKnown(doc, PATHS.jobs, {});
}

/**
 * Add a trigger event under `on`, writing to a map (or converting a list to a map).
 * Returns true when a new event was added, false when it already existed.
 */
export function addTrigger(doc: Document, event: string, config: YamlRecord): boolean {
  const existing = doc.getIn(PATHS.on, true);
  let onMap: YAMLMap;

  if (isMap(existing)) {
    onMap = existing;
  } else {
    // Convert a sequence of event names into a map, preserving the events.
    const seed: YamlRecord = {};
    if (isSeq(existing)) {
      for (const node of existing.items) {
        seed[String(nodeValue(node))] = {};
      }
    }
    seed[event] = config;
    setKnown(doc, PATHS.on, seed);
    return true;
  }

  if (onMap.has(event)) return false;
  onMap.set(event, doc.createNode(config));
  return true;
}

/** Remove a trigger event. Leaves `on` as an empty map if it was the last one. */
export function removeTrigger(doc: Document, event: string): void {
  const node = doc.getIn(PATHS.on, true);
  if (isMap(node)) node.delete(event);
}

/** Update the config of a trigger. Only known keys are written. */
export function updateTrigger(doc: Document, event: string, config: YamlRecord): void {
  const node = doc.getIn([...PATHS.on, event], true);
  if (isMap(node)) {
    for (const [key, value] of Object.entries(config)) {
      node.set(key, doc.createNode(value));
    }
  }
}

/** Add a new job with a stable unique id. */
export function addJob(doc: Document, baseId = 'job'): string {
  createEmptyJobsMap(doc);
  const jobs = ensureMap(doc, PATHS.jobs);
  let id = baseId;
  let counter = 2;
  while (jobs.has(id)) {
    id = `${baseId}-${counter++}`;
  }
  setKnown(doc, PATHS.job(id), {
    'runs-on': 'ubuntu-latest',
    steps: [],
  });
  return id;
}

/** Remove a job entirely. */
export function removeJob(doc: Document, id: string): void {
  deleteKnown(doc, PATHS.job(id));
  // Remove dangling needs references in other jobs.
  const jobsNode = doc.getIn(PATHS.jobs, true);
  if (!isMap(jobsNode)) return;
  for (const pair of jobsNode.items) {
    const jobId = String(nodeValue(pair.key));
    const needsNode = doc.getIn(PATHS.needs(jobId), true);
    if (isSeq(needsNode)) {
      const filtered = needsNode.items.filter((item) => String(nodeValue(item)) !== id);
      needsNode.items = filtered;
      if (filtered.length === 0) deleteKnown(doc, PATHS.needs(jobId));
    }
  }
}

/** Rename a job id by moving its map to a new key while preserving position. */
export function renameJob(doc: Document, oldId: string, newId: string): void {
  if (oldId === newId || newId.trim() === '') return;
  const jobs = doc.getIn(PATHS.jobs, true);
  if (!isMap(jobs) || !jobs.has(oldId) || jobs.has(newId)) return;
  const node = jobs.get(oldId, true);
  jobs.set(newId, node);
  jobs.delete(oldId);
  // Update needs references across all jobs.
  for (const pair of jobs.items) {
    const jobId = String(nodeValue(pair.key));
    const needsNode = doc.getIn(PATHS.needs(jobId), true);
    if (isSeq(needsNode)) {
      needsNode.items = needsNode.items.map((item) =>
        String(nodeValue(item)) === oldId ? doc.createNode(newId) : item,
      );
    }
    const needsValue = getIn(doc, PATHS.needs(jobId));
    if (Array.isArray(needsValue)) setKnown(doc, PATHS.needs(jobId), needsValue);
  }
}

function setJobField(
  doc: Document,
  id: string,
  field: string,
  value: unknown,
  removeWhenEmpty = false,
): void {
  const path: Path = [...PATHS.job(id), field];
  if (removeWhenEmpty && (value === undefined || value === null || value === '')) {
    deleteKnown(doc, path);
  } else {
    setKnown(doc, path, value);
  }
}

export function setJobName(doc: Document, id: string, name: string): void {
  setJobField(doc, id, 'name', name, true);
}

export function setJobRunsOn(doc: Document, id: string, runsOn: string): void {
  setJobField(doc, id, 'runs-on', runsOn, true);
}

export function setJobIf(doc: Document, id: string, condition: string): void {
  setJobField(doc, id, 'if', condition, true);
}

export function setJobNeeds(doc: Document, id: string, needs: string[]): void {
  if (needs.length === 0) deleteKnown(doc, PATHS.needs(id));
  else setKnown(doc, PATHS.needs(id), needs);
}

export function setJobEnv(doc: Document, id: string, env: YamlRecord): void {
  if (Object.keys(env).length === 0) deleteKnown(doc, PATHS.env(id));
  else setKnown(doc, PATHS.env(id), env);
}

export function setStrategy(doc: Document, id: string, strategy: unknown): void {
  if (strategy === undefined) deleteKnown(doc, PATHS.strategy(id));
  else setKnown(doc, PATHS.strategy(id), strategy);
}

/** Append a step to a job, returning its UI id. */
export function addStep(doc: Document, jobId: string, defaults: YamlRecord = {}): string {
  const stepsNode = doc.getIn(PATHS.steps(jobId), true);
  let steps: YAMLSeq;
  if (isSeq(stepsNode)) {
    steps = stepsNode;
  } else {
    setKnown(doc, PATHS.steps(jobId), []);
    steps = doc.getIn(PATHS.steps(jobId), true) as YAMLSeq;
  }
  const clean: YamlRecord = { ...defaults };
  steps.add(doc.createNode(clean));
  return createId('step');
}

/** Remove a step at an index. */
export function removeStep(doc: Document, jobId: string, index: number): void {
  const steps = doc.getIn(PATHS.steps(jobId), true);
  if (isSeq(steps) && index >= 0 && index < steps.items.length) {
    steps.delete(index);
    if (steps.items.length === 0) deleteKnown(doc, PATHS.steps(jobId));
  }
}

/** Update one field of a step. */
export function setStepField(
  doc: Document,
  jobId: string,
  index: number,
  field: string,
  value: unknown,
): void {
  const path = [...PATHS.step(jobId, index), field];
  if (value === undefined || value === null || value === '') deleteKnown(doc, path);
  else setKnown(doc, path, value);
}

export function moveJob(doc: Document, from: number, to: number): void {
  reorderMap(doc, PATHS.jobs, from, to);
}

export function moveStep(doc: Document, jobId: string, from: number, to: number): void {
  reorderSeq(doc, PATHS.steps(jobId), from, to);
}

/** Rebuild the entire document from scratch (used by New/Import). */
export function resetDocument(doc: Document, workflow: Workflow): void {
  for (const key of ['name', 'on', 'jobs']) {
    deleteKnown(doc, [key]);
  }
  if (workflow.name) setKnown(doc, PATHS.name, workflow.name);
  if (workflow.triggers.length > 0) {
    const triggers: YamlRecord = {};
    for (const trigger of workflow.triggers) triggers[trigger.event] = trigger.config;
    setKnown(doc, PATHS.on, triggers);
  }
  if (workflow.jobs.length > 0) {
    const jobs: YamlRecord = {};
    for (const job of workflow.jobs) jobs[job.id] = serializeJob(job);
    setKnown(doc, PATHS.jobs, jobs);
  }
}

/** Convert a model job back into a YAML-compatible record. */
export function serializeJob(job: Job): YamlRecord {
  const record: YamlRecord = {};
  if (job.name) record.name = job.name;
  if (job.runsOn) record['runs-on'] = job.runsOn;
  if (job.needs.length > 0) record.needs = job.needs;
  if (job.if) record.if = job.if;
  if (job.env && Object.keys(job.env).length > 0) record.env = job.env;
  if (job.strategy) {
    const strategy: YamlRecord = {};
    if (job.strategy.matrix) strategy.matrix = job.strategy.matrix;
    if (job.strategy.failFast !== undefined) strategy['fail-fast'] = job.strategy.failFast;
    if (job.strategy.maxParallel !== undefined) strategy['max-parallel'] = job.strategy.maxParallel;
    record.strategy = strategy;
  }
  record.steps = job.steps.map((step: Step) => serializeStep(step));
  return record;
}

/** Convert a model step back into a YAML-compatible record. */
export function serializeStep(step: Step): YamlRecord {
  const record: YamlRecord = {};
  if (step.name) record.name = step.name;
  if (step.uses) record.uses = step.uses;
  if (step.run) record.run = step.run;
  if (step.if) record.if = step.if;
  if (step.workingDirectory) record['working-directory'] = step.workingDirectory;
  if (step.with && Object.keys(step.with).length > 0) record.with = step.with;
  if (step.env && Object.keys(step.env).length > 0) record.env = step.env;
  return record;
}
