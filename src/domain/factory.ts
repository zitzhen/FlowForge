/** Factory helpers that create fresh model objects with stable UI ids. */

import { createId } from './ids';
import type { Job, Step, Trigger, Workflow } from './types';

export function createWorkflow(): Workflow {
  return { triggers: [], jobs: [] };
}

export function createTrigger(event = 'push'): Trigger {
  return { id: createId('trigger'), event, config: {} };
}

export function createStep(defaults: Partial<Step> = {}): Step {
  return {
    id: createId('step'),
    ...defaults,
  };
}

export function createJob(id: string, defaults: Partial<Job> = {}): Job {
  return {
    id,
    needs: [],
    steps: [],
    ...defaults,
  };
}
