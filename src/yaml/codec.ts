/** YAML codec: parsing and serialization with comment/field preservation. */
import { type Document, parseDocument } from 'yaml';

export interface ImportResult {
  doc: Document.Parsed;
  errors: string[];
  warnings: string[];
}

/** Maximum accepted import size (1 MiB) to keep the UI responsive. */
export const MAX_IMPORT_BYTES = 1024 * 1024;

/**
 * Parse a workflow YAML string into a yaml Document.
 * The Document API keeps comments, key order and unknown fields intact.
 */
export function importYaml(text: string): ImportResult {
  if (new TextEncoder().encode(text).byteLength > MAX_IMPORT_BYTES) {
    return {
      doc: parseDocument(''),
      errors: ['Input exceeds the 1 MiB size limit.'],
      warnings: [],
    };
  }

  const doc = parseDocument(text, { prettyErrors: true });
  const errors = doc.errors.map((error) => error.message);
  const warnings = doc.warnings.map((warning) => warning.message);
  return { doc, errors, warnings };
}

/** Serialize a Document back to YAML text, best-effort even when parsing had errors. */
export function exportYaml(doc: Document): string {
  // yaml refuses to stringify a document that still carries parse errors.
  // Clear them for a best-effort export; the import UI already surfaces them.
  doc.errors = [];
  doc.warnings = [];
  return doc.toString({ indent: 2, lineWidth: 0 });
}
