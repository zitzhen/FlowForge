import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import {
  addJob,
  addStep,
  addTrigger,
  moveJob,
  moveStep,
  removeJob,
  removeStep,
  removeTrigger,
  renameJob,
  setJobNeeds,
  setJobRunsOn,
  setName,
  setStepField,
} from '../yaml/applyModel';
import { exportYaml, importYaml } from '../yaml/codec';
import { mapToModel } from '../yaml/mapToModel';

const parseOut = (doc: ReturnType<typeof importYaml>['doc']) =>
  parse(exportYaml(doc)) as Record<string, any>;

describe('applyModel editing commands', () => {
  it('sets and deletes the workflow name', () => {
    const { doc } = importYaml('name: Old\njobs: {}');
    setName(doc, 'New');
    expect(parseOut(doc).name).toBe('New');
    setName(doc, '');
    expect(parseOut(doc).name).toBeUndefined();
  });

  it('adds and removes triggers', () => {
    const { doc } = importYaml('jobs: {}');
    addTrigger(doc, 'push', { branches: ['main'] });
    addTrigger(doc, 'workflow_dispatch', {});
    expect(mapToModel(doc).triggers.map((t) => t.event)).toEqual(['push', 'workflow_dispatch']);
    removeTrigger(doc, 'push');
    expect(mapToModel(doc).triggers.map((t) => t.event)).toEqual(['workflow_dispatch']);
  });

  it('adds jobs with unique ids and updates runs-on', () => {
    const { doc } = importYaml('');
    const first = addJob(doc, 'job');
    const second = addJob(doc, 'job');
    expect(first).toBe('job');
    expect(second).toBe('job-2');
    setJobRunsOn(doc, first, 'windows-latest');
    expect(parseOut(doc).jobs[first]['runs-on']).toBe('windows-latest');
  });

  it('renames a job and rewrites needs references', () => {
    const { doc } = importYaml(
      'jobs:\n  a:\n    runs-on: ubuntu-latest\n  b:\n    needs: [a]\n    runs-on: ubuntu-latest',
    );
    renameJob(doc, 'a', 'build');
    const out = parseOut(doc);
    expect(out.jobs.build).toBeDefined();
    expect(out.jobs.a).toBeUndefined();
    expect(out.jobs.b.needs).toEqual(['build']);
  });

  it('removes a job and cleans dangling needs', () => {
    const { doc } = importYaml(
      'jobs:\n  a:\n    runs-on: ubuntu-latest\n  b:\n    needs: [a]\n    runs-on: ubuntu-latest',
    );
    removeJob(doc, 'a');
    expect(parseOut(doc).jobs.b.needs).toBeUndefined();
  });

  it('adds, edits, reorders and removes steps', () => {
    const { doc } = importYaml('jobs:\n  build:\n    runs-on: ubuntu-latest\n    steps: []');
    addStep(doc, 'build', { uses: 'actions/checkout@v4' });
    addStep(doc, 'build', { run: 'npm test' });
    let model = mapToModel(doc);
    expect(model.jobs[0]?.steps).toHaveLength(2);
    setStepField(doc, 'build', 1, 'name', 'Test');
    expect(parseOut(doc).jobs.build.steps[1].name).toBe('Test');
    moveStep(doc, 'build', 0, 1);
    model = mapToModel(doc);
    expect(model.jobs[0]?.steps[0]?.run).toBe('npm test');
    removeStep(doc, 'build', 0);
    model = mapToModel(doc);
    expect(model.jobs[0]?.steps).toHaveLength(1);
  });

  it('sets needs and reorders jobs', () => {
    const { doc } = importYaml(
      'jobs:\n  a:\n    runs-on: ubuntu-latest\n  b:\n    runs-on: ubuntu-latest',
    );
    setJobNeeds(doc, 'b', ['a']);
    expect(parseOut(doc).jobs.b.needs).toEqual(['a']);
    moveJob(doc, 0, 1);
    expect(mapToModel(doc).jobs.map((j) => j.id)).toEqual(['b', 'a']);
  });

  it('preserves unknown fields when editing steps', () => {
    const source =
      'name: CI\ncustom-top: keep\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          custom: value';
    const { doc } = importYaml(source);
    setStepField(doc, 'build', 0, 'name', 'Checkout');
    const out = parseOut(doc);
    expect(out.customTop ?? out['custom-top']).toBe('keep');
    expect(out.jobs.build.steps[0].with.custom).toBe('value');
  });
});
