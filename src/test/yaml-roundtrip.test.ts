import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { exportYaml, importYaml } from '../yaml/codec';
import { mapToModel } from '../yaml/mapToModel';
import { PATHS, setKnown } from '../yaml/paths';

const fixture = (name: string): string =>
  readFileSync(resolve(process.cwd(), 'src/test/fixtures', name), 'utf8');

describe('YAML round-trip preservation', () => {
  const source = fixture('sample-workflow.yml');

  it('keeps semantic equivalence after import and export', () => {
    const result = importYaml(source);
    const output = exportYaml(result.doc);
    expect(parse(output)).toEqual(parse(source));
  });

  it('preserves comments and unknown fields verbatim', () => {
    const output = exportYaml(importYaml(source).doc);
    expect(output).toContain('# This comment must survive a round-trip.');
    expect(parse(output)).toHaveProperty('concurrency');
    expect(parse(output)).toHaveProperty('permissions');
  });

  it('reports parse errors as warnings without throwing', () => {
    const result = importYaml('name: [unclosed');
    expect(result.errors.length).toBeGreaterThan(0);
    expect(() => exportYaml(result.doc)).not.toThrow();
  });

  it('rejects oversized input', () => {
    const result = importYaml('x'.repeat(1024 * 1024 + 1));
    expect(result.errors[0]).toContain('1 MiB');
  });
});

describe('model projection', () => {
  it('projects triggers, jobs, steps, needs and matrix from the document', () => {
    const model = mapToModel(importYaml(fixture('sample-workflow.yml')).doc);
    expect(model.name).toBe('CI Pipeline');
    expect(model.triggers.map((t) => t.event)).toEqual(['push', 'pull_request']);
    expect(model.jobs.map((j) => j.id)).toEqual(['build', 'deploy']);
    expect(model.jobs[0]?.steps).toHaveLength(4);
    expect(model.jobs[1]?.needs).toEqual(['build']);
    expect(model.jobs[0]?.strategy?.matrix).toEqual({ node: [20, 22] });
  });

  it('treats on as a string key, not a boolean', () => {
    const model = mapToModel(importYaml('on: push\njobs: {}').doc);
    expect(model.triggers.map((t) => t.event)).toContain('push');
  });
});

describe('editing known fields', () => {
  it('updates the name while keeping unknown fields and comments', () => {
    const source = fixture('sample-workflow.yml');
    const result = importYaml(source);
    setKnown(result.doc, PATHS.name, 'CI Pipeline v2');
    const output = exportYaml(result.doc);
    const parsed = parse(output) as Record<string, unknown>;
    expect(parsed.name).toBe('CI Pipeline v2');
    expect(parsed).toHaveProperty('concurrency');
    expect(parsed).toHaveProperty('permissions');
    expect(output).toContain('# This comment must survive a round-trip.');
  });
});
