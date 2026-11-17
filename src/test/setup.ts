// Shared test setup for jsdom environment.

// jsdom does not implement ResizeObserver, which React Flow relies on.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// jsdom does not implement DOMMatrixReadOnly, used by React Flow.
if (!globalThis.DOMMatrixReadOnly) {
  globalThis.DOMMatrixReadOnly = class DOMMatrixReadOnly {
    m22 = 1;
  } as unknown as typeof DOMMatrixReadOnly;
}
