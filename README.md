# FlowForge

A low-code visual editor for GitHub Actions workflow YAML. Drag building blocks to compose a
workflow, import an existing YAML file to edit it, and export the result — all in the browser.
No backend, no GitHub API calls, and no account required.

> MVP1 is a static client-side application. Data lives in memory and is lost on refresh; use
> **Export** to keep your work.

## Features

- **Block-based editing** — drag triggers, jobs and steps from the palette into the editor, and
  reorder jobs and steps by dragging their handles.
- **Bilingual UI** — Chinese labels with English terms alongside (e.g. "触发器 Trigger").
- **Lossless YAML** — built on the `yaml` package's Document API, so comments, key order and
  fields the editor does not understand are preserved on import → edit → export.
- **Live workflow graph** — a read-only React Flow preview shows jobs layered by their `needs`
  dependencies and updates as you edit.
- **Live YAML preview** — the serialized YAML updates instantly and can be copied with one click.
- **Import / Export** — paste YAML or choose a local file to import; download `workflow.yml` to
  export.

## Supported fields (MVP1)

The editor exposes a common subset of GitHub Actions syntax:

- Workflow: `name`, `on`
- Job: `name`, `runs-on`, `needs`, `if`, `env`, `strategy` (matrix is kept as an opaque object)
- Step: `name`, `uses`, `with`, `run`, `if`, `env`, `working-directory`

Any other keys (for example `concurrency`, `permissions` or action-specific inputs) are left
untouched in the document and survive a round-trip.

## Requirements

- Node.js 22 or newer (npm 10; `pnpm` and `yarn` are not required)

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed by Vite (by default <http://localhost:5173>). The landing page is the default
entry; click **免费开始搭建** or open `#/workspace` to enter the editor, and use **← 首页** in the
workspace toolbar to return.

## Scripts

| Command              | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Start the development server.                          |
| `npm run build`      | Type-check and build the production site into `dist/`. |
| `npm run preview`    | Preview the production build locally.                  |
| `npm run test`       | Run the test suite once.                               |
| `npm run test:watch` | Run tests in watch mode.                               |
| `npm run lint`       | Check formatting and lint rules.                       |
| `npm run lint:fix`   | Apply safe formatting and lint fixes.                  |

## Deployment to Cloudflare Pages

This is a pure static site. The build uses a relative asset base (`base: './'`), so `dist/` can be
served from any path.

1. Build locally:

   ```bash
   npm install
   npm run build
   ```

2. Upload the generated `dist/` directory to Cloudflare Pages (either via Direct Upload in the
   dashboard, or `wrangler pages deploy dist --project-name <your-project>`).

3. Configure the build settings if you prefer Cloudflare to build from source:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: 22

No environment variables or secrets are required.

## Project structure

```text
src/
  domain/        Workflow model, block catalog, factories and IDs
  yaml/          Document-based import/export, known-path editing and model projection
  flow/          Derive React Flow nodes/edges from job needs
  store/         Zustand store holding the yaml.Document as the single source of truth
  i18n/          Bilingual label dictionary
  components/    Layout, block palette, editor, previews and toolbar
  test/          Unit and integration tests plus YAML fixtures
```

## License

AGPL-3.0-only. See [LICENSE](./LICENSE).
