/** Zustand store: the yaml.Document is the single source of truth. */

import type { Document } from 'yaml';
import { create } from 'zustand';
import { createWorkflow } from '../domain/factory';
import type { Workflow, YamlRecord } from '../domain/types';
import {
  addJob as addJobCmd,
  addStep as addStepCmd,
  addTrigger as addTriggerCmd,
  moveJob as moveJobCmd,
  moveStep as moveStepCmd,
  removeJob as removeJobCmd,
  removeStep as removeStepCmd,
  removeTrigger as removeTriggerCmd,
  renameJob as renameJobCmd,
  resetDocument as resetDocumentCmd,
  setJobEnv as setJobEnvCmd,
  setJobIf as setJobIfCmd,
  setJobName as setJobNameCmd,
  setJobNeeds as setJobNeedsCmd,
  setJobRunsOn as setJobRunsOnCmd,
  setName as setNameCmd,
  setStepField as setStepFieldCmd,
  setStrategy as setStrategyCmd,
  updateTrigger as updateTriggerCmd,
} from '../yaml/applyModel';
import { exportYaml, type ImportResult, importYaml } from '../yaml/codec';
import { mapToModel } from '../yaml/mapToModel';

export interface WorkflowState {
  /** The single source of truth for all workflow data. */
  doc: Document;
  /** Read-only projection consumed by the UI. */
  model: Workflow;
  /** Serialized YAML for the preview pane. */
  yamlText: string;
  /** Parse errors from the last import. */
  errors: string[];
  /** Parse warnings from the last import. */
  warnings: string[];

  // Workflow-level actions
  setName: (name: string) => void;
  newWorkflow: () => void;
  importYaml: (text: string) => ImportResult;

  // Trigger actions
  addTrigger: (event: string, config: YamlRecord) => void;
  updateTrigger: (event: string, config: YamlRecord) => void;
  removeTrigger: (event: string) => void;

  // Job actions
  addJob: (baseId?: string) => string;
  removeJob: (id: string) => void;
  renameJob: (oldId: string, newId: string) => void;
  moveJob: (from: number, to: number) => void;
  setJobName: (id: string, name: string) => void;
  setJobRunsOn: (id: string, runsOn: string) => void;
  setJobIf: (id: string, condition: string) => void;
  setJobNeeds: (id: string, needs: string[]) => void;
  setJobEnv: (id: string, env: YamlRecord) => void;
  setStrategy: (id: string, strategy: unknown) => void;

  // Step actions
  addStep: (jobId: string, defaults?: YamlRecord) => string;
  removeStep: (jobId: string, index: number) => void;
  moveStep: (jobId: string, from: number, to: number) => void;
  setStepField: (jobId: string, index: number, field: string, value: unknown) => void;
}

const initial = importYaml('name: CI Workflow\non:\n  push:\n    branches: [main]\njobs: {}');

/** Apply a mutation to the document, then re-project the model and YAML text. */
function commit(state: WorkflowState, mutate: (doc: Document) => void): Partial<WorkflowState> {
  mutate(state.doc);
  return {
    model: mapToModel(state.doc),
    yamlText: exportYaml(state.doc),
  };
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  doc: initial.doc,
  model: mapToModel(initial.doc),
  yamlText: exportYaml(initial.doc),
  errors: initial.errors,
  warnings: initial.warnings,

  setName: (name) => set((state) => commit(state, (doc) => setNameCmd(doc, name))),

  newWorkflow: () =>
    set((state) => {
      resetDocumentCmd(state.doc, createWorkflow());
      return {
        doc: state.doc,
        model: mapToModel(state.doc),
        yamlText: exportYaml(state.doc),
        errors: [],
        warnings: [],
      };
    }),

  importYaml: (text) => {
    const result = importYaml(text);
    set({
      doc: result.doc,
      model: mapToModel(result.doc),
      yamlText: exportYaml(result.doc),
      errors: result.errors,
      warnings: result.warnings,
    });
    return result;
  },

  addTrigger: (event, config) =>
    set((state) => commit(state, (doc) => addTriggerCmd(doc, event, config))),
  updateTrigger: (event, config) =>
    set((state) => commit(state, (doc) => updateTriggerCmd(doc, event, config))),
  removeTrigger: (event) => set((state) => commit(state, (doc) => removeTriggerCmd(doc, event))),

  addJob: (baseId) => {
    let id = '';
    set((state) => {
      const result = commit(state, (doc) => {
        id = addJobCmd(doc, baseId);
      });
      return result;
    });
    return id;
  },
  removeJob: (id) => set((state) => commit(state, (doc) => removeJobCmd(doc, id))),
  renameJob: (oldId, newId) =>
    set((state) => commit(state, (doc) => renameJobCmd(doc, oldId, newId))),
  moveJob: (from, to) => set((state) => commit(state, (doc) => moveJobCmd(doc, from, to))),
  setJobName: (id, name) => set((state) => commit(state, (doc) => setJobNameCmd(doc, id, name))),
  setJobRunsOn: (id, runsOn) =>
    set((state) => commit(state, (doc) => setJobRunsOnCmd(doc, id, runsOn))),
  setJobIf: (id, condition) =>
    set((state) => commit(state, (doc) => setJobIfCmd(doc, id, condition))),
  setJobNeeds: (id, needs) =>
    set((state) => commit(state, (doc) => setJobNeedsCmd(doc, id, needs))),
  setJobEnv: (id, env) => set((state) => commit(state, (doc) => setJobEnvCmd(doc, id, env))),
  setStrategy: (id, strategy) =>
    set((state) => commit(state, (doc) => setStrategyCmd(doc, id, strategy))),

  addStep: (jobId, defaults) => {
    let id = '';
    set((state) => {
      const result = commit(state, (doc) => {
        id = addStepCmd(doc, jobId, defaults);
      });
      return result;
    });
    return id;
  },
  removeStep: (jobId, index) =>
    set((state) => commit(state, (doc) => removeStepCmd(doc, jobId, index))),
  moveStep: (jobId, from, to) =>
    set((state) => commit(state, (doc) => moveStepCmd(doc, jobId, from, to))),
  setStepField: (jobId, index, field, value) =>
    set((state) => commit(state, (doc) => setStepFieldCmd(doc, jobId, index, field, value))),
}));
