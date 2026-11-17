/** Bilingual UI labels. Chinese is primary; English terms are shown alongside. */
import type { BilingualLabel } from '../domain/types';

export const LABELS = {
  appName: { zh: 'FlowForge', en: 'FlowForge' },
  blocks: { zh: '积木', en: 'Blocks' },
  editor: { zh: '编排', en: 'Editor' },
  workflowGraph: { zh: '流程图', en: 'Workflow Graph' },
  yamlPreview: { zh: 'YAML 预览', en: 'YAML Preview' },
  name: { zh: '名称', en: 'Name' },
  triggers: { zh: '触发器', en: 'Triggers' },
  trigger: { zh: '触发器', en: 'Trigger' },
  jobs: { zh: '作业', en: 'Jobs' },
  job: { zh: '作业', en: 'Job' },
  steps: { zh: '步骤', en: 'Steps' },
  step: { zh: '步骤', en: 'Step' },
  runsOn: { zh: '运行环境', en: 'Runs On' },
  needs: { zh: '依赖', en: 'Needs' },
  strategy: { zh: '策略', en: 'Strategy' },
  env: { zh: '环境变量', en: 'Environment' },
  if: { zh: '条件', en: 'If' },
  with: { zh: '参数', en: 'With' },
  uses: { zh: '使用', en: 'Uses' },
  run: { zh: '命令', en: 'Run' },
  workingDirectory: { zh: '工作目录', en: 'Working Directory' },
  addJob: { zh: '添加作业', en: 'Add Job' },
  addStep: { zh: '添加步骤', en: 'Add Step' },
  remove: { zh: '删除', en: 'Remove' },
  import: { zh: '导入', en: 'Import' },
  export: { zh: '导出', en: 'Export' },
  newWorkflow: { zh: '新建', en: 'New' },
  copy: { zh: '复制', en: 'Copy' },
  copied: { zh: '已复制', en: 'Copied' },
  importTitle: { zh: '导入 YAML', en: 'Import YAML' },
  importHint: { zh: '粘贴 YAML 内容或选择文件', en: 'Paste YAML or choose a file' },
  cancel: { zh: '取消', en: 'Cancel' },
  confirm: { zh: '确定', en: 'Confirm' },
  parseErrors: { zh: '解析警告', en: 'Parse Warnings' },
  noJobs: { zh: '暂无作业，从左侧拖入积木开始', en: 'No jobs yet, drag a block from the left' },
  noTriggers: { zh: '暂无触发器', en: 'No triggers yet' },
  dropStepHere: { zh: '拖入步骤', en: 'Drop steps here' },
  dropBlockHere: { zh: '拖入积木到此处', en: 'Drop a block here' },
  workflowName: { zh: 'CI Workflow', en: 'CI Workflow' },
  branches: { zh: '分支', en: 'Branches' },
  paths: { zh: '路径', en: 'Paths' },
  cron: { zh: '定时表达式', en: 'Cron' },
  noTriggerConfig: { zh: '该触发器无需额外配置', en: 'No extra configuration' },
  undo: { zh: '撤销', en: 'Undo' },
  redo: { zh: '重做', en: 'Redo' },
} satisfies Record<string, BilingualLabel>;

export type LabelKey = keyof typeof LABELS;

/** Format a bilingual label as "中文 English". */
export function labelText(label: BilingualLabel): string {
  return `${label.zh} ${label.en}`;
}

export function t(key: LabelKey): BilingualLabel {
  return LABELS[key];
}
