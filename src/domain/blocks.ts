/** Block palette catalog. Each block writes a known field fragment into the workflow. */
import type { BlockMeta } from './types';

export const BLOCKS: BlockMeta[] = [
  {
    kind: 'trigger',
    type: 'push',
    label: { zh: '推送触发', en: 'Push Trigger' },
    description: { zh: '代码推送到分支时触发', en: 'Run on push to branches' },
    scope: 'workflow',
    defaults: { branches: ['main'] },
  },
  {
    kind: 'trigger',
    type: 'pull_request',
    label: { zh: '拉取请求触发', en: 'Pull Request' },
    description: { zh: '创建或更新 PR 时触发', en: 'Run on pull request events' },
    scope: 'workflow',
    defaults: { branches: ['main'] },
  },
  {
    kind: 'trigger',
    type: 'workflow_dispatch',
    label: { zh: '手动触发', en: 'Manual Dispatch' },
    scope: 'workflow',
    defaults: {},
  },
  {
    kind: 'trigger',
    type: 'schedule',
    label: { zh: '定时触发', en: 'Schedule' },
    description: { zh: '按 cron 计划定时运行', en: 'Run on a cron schedule' },
    scope: 'workflow',
    defaults: { cron: '0 0 * * *' },
  },
  {
    kind: 'job',
    type: 'blank',
    label: { zh: '空白作业', en: 'Blank Job' },
    description: { zh: '添加一个新的 job', en: 'Add a new job' },
    scope: 'workflow',
    defaults: { 'runs-on': 'ubuntu-latest' },
  },
  {
    kind: 'step',
    type: 'checkout',
    label: { zh: '检出代码', en: 'Checkout' },
    description: { zh: '检出仓库代码', en: 'actions/checkout@v4' },
    scope: 'job',
    defaults: { uses: 'actions/checkout@v4' },
  },
  {
    kind: 'step',
    type: 'setup-node',
    label: { zh: '配置 Node.js', en: 'Setup Node.js' },
    description: { zh: '安装指定版本的 Node.js', en: 'actions/setup-node@v4' },
    scope: 'job',
    defaults: { uses: 'actions/setup-node@v4', with: { 'node-version': '22' } },
  },
  {
    kind: 'step',
    type: 'run',
    label: { zh: '运行命令', en: 'Run Command' },
    description: { zh: '执行一段 shell 命令', en: 'Execute a shell command' },
    scope: 'job',
    defaults: { run: 'echo "Hello from FlowForge"' },
  },
];

export function getBlock(kind: BlockMeta['kind'], type: string): BlockMeta | undefined {
  return BLOCKS.find((block) => block.kind === kind && block.type === type);
}
