/** Known YAML paths and helpers for editing only fields the editor understands. */
import { type Document, isMap, isSeq, type Node, type YAMLMap, type YAMLSeq } from 'yaml';

export type Path = (string | number)[];

export const PATHS: {
  name: Path;
  on: Path;
  jobs: Path;
  job: (id: string) => Path;
  nameOfJob: (id: string) => Path;
  runsOn: (id: string) => Path;
  needs: (id: string) => Path;
  steps: (id: string) => Path;
  step: (id: string, index: number) => Path;
  strategy: (id: string) => Path;
  env: (id: string) => Path;
  if: (id: string) => Path;
} = {
  name: ['name'],
  on: ['on'],
  jobs: ['jobs'],
  job: (id: string): Path => ['jobs', id],
  nameOfJob: (id: string): Path => ['jobs', id, 'name'],
  runsOn: (id: string): Path => ['jobs', id, 'runs-on'],
  needs: (id: string): Path => ['jobs', id, 'needs'],
  steps: (id: string): Path => ['jobs', id, 'steps'],
  step: (id: string, index: number): Path => ['jobs', id, 'steps', index],
  strategy: (id: string): Path => ['jobs', id, 'strategy'],
  env: (id: string): Path => ['jobs', id, 'env'],
  if: (id: string): Path => ['jobs', id, 'if'],
};

/** Read a value from the document as plain JS, or undefined when absent. */
export function getIn(doc: Document, path: Path): unknown {
  const node = doc.getIn(path, true) as Node | undefined;
  return node?.toJSON();
}

/** Set a known field. The Document API splices the change into the original CST. */
export function setKnown(doc: Document, path: Path, value: unknown): void {
  doc.setIn(path, doc.createNode(value));
}

/** Delete a known field. */
export function deleteKnown(doc: Document, path: Path): void {
  doc.deleteIn(path);
}

/** Reorder items in a known YAML sequence (used for jobs and steps). */
export function reorderSeq(doc: Document, path: Path, from: number, to: number): void {
  const node = doc.getIn(path, true) as YAMLSeq | undefined;
  if (!node || !isSeq(node)) return;
  const [item] = node.items.splice(from, 1);
  if (item !== undefined) node.items.splice(to, 0, item);
}

/** Ensure a map node exists at a path, creating intermediate maps as needed. */
export function ensureMap(doc: Document, path: Path): YAMLMap {
  let node: any = doc.contents;
  for (const key of path) {
    if (!isMap(node)) {
      throw new Error(`Expected a map at path ${JSON.stringify(path)}`);
    }
    let child: any = node.get(key, true);
    if (!child) {
      child = doc.createNode({});
      node.set(key, child);
    }
    node = child;
  }
  return node as YAMLMap;
}

/** Read a value from a YAML node (which may be a Scalar or a raw JS value). */
export function nodeValue(node: unknown): unknown {
  if (node && typeof node === 'object' && typeof (node as Node).toJSON === 'function') {
    return (node as Node).toJSON();
  }
  return node;
}

/** Return the ordered keys of a map node in the document. */
export function orderedKeys(doc: Document, path: Path): string[] {
  const node = doc.getIn(path, true);
  if (!isMap(node)) return [];
  return node.items
    .map((pair) => pair.key)
    .filter((key): key is NonNullable<typeof key> => key != null)
    .map((key) => String(nodeValue(key)));
}

/** Reorder entries in a YAMLMap (used to reorder jobs by key position). */
export function reorderMap(doc: Document, path: Path, from: number, to: number): void {
  const node = doc.getIn(path, true);
  if (!isMap(node)) return;
  const [item] = node.items.splice(from, 1);
  if (item) node.items.splice(to, 0, item);
}
