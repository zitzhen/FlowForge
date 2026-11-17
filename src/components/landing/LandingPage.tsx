import type { ReactNode } from 'react';
import './landing.css';

const WORKSPACE_HREF = '#/workspace';

type CodeLine = {
  no: number;
  content: ReactNode;
};

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { label: '产品能力', href: '#features' },
  { label: '工作原理', href: '#how-it-works' },
  { label: '开发文档', href: 'https://docs.github.com/actions', external: true },
  { label: '价格', href: '#get-started' },
  { label: 'GitHub', href: 'https://github.com/features/actions', external: true },
];

const STEPS = [
  {
    no: '01',
    glyph: '▧',
    title: '拖拽积木',
    description: '从积木库中选择 Trigger、Action 等模块，像搭积木一样拖到画布上。',
  },
  {
    no: '02',
    glyph: '⌁',
    title: '连接编排',
    description: '用连线定义执行顺序、条件与依赖，配置参数全部通过可视化表单完成。',
  },
  {
    no: '03',
    glyph: '▤',
    title: '导出 YAML',
    description: '一键生成规范的 workflow YAML，可直接复制到提交仓库，随时反向编辑。',
  },
];

const HERO_YAML: CodeLine[] = [
  {
    no: 1,
    content: (
      <>
        <span className="tok-key">name</span>: CI Pipeline
      </>
    ),
  },
  {
    no: 2,
    content: (
      <>
        <span className="tok-key">on</span>: [<span className="tok-str">push</span>]
      </>
    ),
  },
  {
    no: 3,
    content: (
      <>
        <span className="tok-key">jobs</span>:
      </>
    ),
  },
  {
    no: 4,
    content: (
      <>
        {'  '}
        <span className="tok-key">build</span>:
      </>
    ),
  },
  {
    no: 5,
    content: (
      <>
        {'    '}
        <span className="tok-key">runs-on</span>: <span className="tok-str">ubuntu-latest</span>
      </>
    ),
  },
  {
    no: 6,
    content: (
      <>
        {'    '}
        <span className="tok-key">steps</span>:
      </>
    ),
  },
  {
    no: 7,
    content: (
      <>
        {'      '}- <span className="tok-key">uses</span>:{' '}
        <span className="tok-str">actions/checkout@v4</span>
      </>
    ),
  },
  {
    no: 8,
    content: (
      <>
        {'      '}- <span className="tok-key">run</span>:{' '}
        <span className="tok-str">npm run build</span>
      </>
    ),
  },
  {
    no: 9,
    content: (
      <>
        {'      '}- <span className="tok-key">run</span>:{' '}
        <span className="tok-str">npm run deploy</span>
      </>
    ),
  },
];

const FEATURE_YAML: CodeLine[] = [
  {
    no: 1,
    content: (
      <>
        <span className="tok-key">name</span>: CI
      </>
    ),
  },
  {
    no: 2,
    content: (
      <>
        <span className="tok-key">on</span>: [<span className="tok-str">push</span>]
      </>
    ),
  },
  {
    no: 3,
    content: (
      <>
        <span className="tok-key">jobs</span>:
      </>
    ),
  },
  {
    no: 4,
    content: (
      <>
        {'  '}
        <span className="tok-key">build</span>:
      </>
    ),
  },
  {
    no: 5,
    content: (
      <>
        {'    '}
        <span className="tok-key">runs-on</span>: <span className="tok-str">ubuntu-latest</span>
      </>
    ),
  },
  {
    no: 6,
    content: (
      <>
        {'    '}
        <span className="tok-key">steps</span>:
      </>
    ),
  },
  {
    no: 7,
    content: (
      <>
        {'      '}- <span className="tok-key">uses</span>:{' '}
        <span className="tok-str">actions/checkout@v4</span>
      </>
    ),
  },
  {
    no: 8,
    content: (
      <>
        {'      '}- <span className="tok-key">uses</span>:{' '}
        <span className="tok-str">actions/setup-node@v4</span>
      </>
    ),
  },
  {
    no: 9,
    content: (
      <>
        {'        '}
        <span className="tok-key">with</span>:
      </>
    ),
  },
  {
    no: 10,
    content: (
      <>
        {'          '}
        <span className="tok-key">node-version</span>: <span className="tok-str">'20'</span>
      </>
    ),
  },
  {
    no: 11,
    content: (
      <>
        {'      '}- <span className="tok-key">run</span>:{' '}
        <span className="tok-str">npm install</span>
      </>
    ),
  },
  {
    no: 12,
    content: (
      <>
        {'      '}- <span className="tok-key">run</span>:{' '}
        <span className="tok-str">npm run build</span>
      </>
    ),
  },
];

type GraphNode = {
  id: string;
  title: string;
  meta: string;
  glyph: string;
  left: string;
  top: string;
  active?: boolean;
};

const GRAPH_NODES: GraphNode[] = [
  { id: 'checkout', title: 'Checkout', meta: 'branch: main', glyph: '⑂', left: '2%', top: '12%' },
  {
    id: 'setup',
    title: 'Setup',
    meta: 'node: v20',
    glyph: '⬡',
    left: '27%',
    top: '12%',
    active: true,
  },
  { id: 'build', title: 'Build', meta: 'target: prod', glyph: '⚙', left: '52%', top: '12%' },
  { id: 'deploy', title: 'Deploy', meta: 'env: staging', glyph: '▸', left: '77%', top: '12%' },
  { id: 'test', title: 'Test', meta: 'suite: unit', glyph: '✓', left: '27%', top: '45%' },
  { id: 'lint', title: 'Lint', meta: 'strict: true', glyph: '◇', left: '52%', top: '45%' },
  { id: 'package', title: 'Package', meta: 'format: tgz', glyph: '▣', left: '77%', top: '45%' },
  { id: 'init', title: 'Init', meta: 'cache: on', glyph: '⌁', left: '2%', top: '78%' },
  { id: 'clean', title: 'Clean', meta: 'keep: 3', glyph: '⌫', left: '52%', top: '78%' },
];

const TEMPLATES = [
  {
    title: 'Config Sync',
    subtitle: '配置同步',
    description: 'Automatically fetch and validate config from a central repository.',
    glyph: '⚙',
  },
  {
    title: 'Deploy Guardian',
    subtitle: '部署守护',
    description: 'Approve production deploys with environment checks and manual sign-off.',
    glyph: '⬡',
    active: true,
  },
  {
    title: 'Security Audit Bot',
    subtitle: '安全审计',
    description: 'Continuously audit dependencies and run security scans on every PR.',
    glyph: '✓',
  },
  {
    title: 'Test Runner Pro',
    subtitle: '测试增强',
    description: 'Shard tests, enforce coverage gates and publish detailed reports.',
    glyph: '▸',
  },
];

const FOOTER_COLUMNS = [
  {
    title: '产品',
    links: NAV_LINKS.slice(0, 2).concat([
      { label: '模板库', href: '#features' },
      { label: '更新日志', href: '#get-started' },
    ]),
  },
  {
    title: '资源',
    links: [
      { label: '开发文档', href: 'https://docs.github.com/actions', external: true },
      {
        label: 'Action 积木库',
        href: 'https://github.com/marketplace?type=actions',
        external: true,
      },
      { label: '示例工作流', href: '#how-it-works' },
      { label: '社区支持', href: 'https://github.com/features/actions', external: true },
    ],
  },
  {
    title: '关于',
    links: [
      { label: '关于我们', href: '#get-started' },
      { label: 'GitHub', href: 'https://github.com/features/actions', external: true },
      { label: '隐私政策', href: '#get-started' },
    ],
  },
];

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="3" y="9" width="7" height="7" rx="2" fill="#39d98a" />
      <rect x="13" y="3" width="7" height="7" rx="2" fill="#39d98a" opacity="0.75" />
      <rect x="14" y="14" width="7" height="7" rx="2" fill="#5b8cff" opacity="0.9" />
      <path d="M10 12.5h3M16.5 10v4" stroke="#080b11" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M3 8.4 6.2 11.5 13 4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M5 3.5 12 8l-7 4.5z" fill="currentColor" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="8"
        rx="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M10.5 3.5h-7a1 1 0 0 0-1 1v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CodeLines({ lines, className = '' }: { lines: CodeLine[]; className?: string }) {
  return (
    <pre className={`code-lines ${className}`}>
      <code>
        {lines.map((line) => (
          <span className="code-lines__row" key={line.no}>
            <span className="code-lines__no">{line.no}</span>
            <span className="code-lines__text">{line.content}</span>
          </span>
        ))}
      </code>
    </pre>
  );
}

function SiteHeader() {
  return (
    <header className="landing__nav">
      <div className="landing__nav-inner">
        <a className="landing__brand" href="#/" aria-label="FlowForge 首页">
          <span className="landing__brand-mark">
            <LogoIcon />
          </span>
          <span>FlowForge</span>
        </a>

        <nav className="landing__nav-links" aria-label="主导航">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="landing__nav-actions">
          <a className="landing__login" href={WORKSPACE_HREF} title="本地演示，无需登录">
            登录
          </a>
          <a
            className="landing__button landing__button--primary landing__button--sm"
            href={WORKSPACE_HREF}
          >
            免费开始
          </a>
        </div>
      </div>
    </header>
  );
}

function StudioMock() {
  return (
    <div className="studio-mock" role="img" aria-label="FlowForge 工作台界面预览">
      <div className="studio-mock__bar">
        <span className="studio-mock__lights">
          <i />
          <i />
          <i />
        </span>
        <span className="studio-mock__title">ci.yml — FlowForge Studio</span>
        <span className="studio-mock__sync">
          <span className="studio-mock__dot" />
          已同步
        </span>
      </div>

      <div className="studio-mock__body">
        <div className="studio-mock__palette">
          <div className="studio-mock__label">积木库</div>
          <div className="studio-mock__search">⌕ 搜索积木</div>
          <div className="studio-mock__hint">触发器与常用步骤</div>
          {[
            { glyph: '↓', label: 'Checkout' },
            { glyph: '⬡', label: 'Setup Node.js' },
            { glyph: '▸', label: 'Run Script' },
            { glyph: '▣', label: 'Cache / artifacts' },
          ].map((item) => (
            <div className="studio-mock__block" key={item.label}>
              <span className="studio-mock__block-glyph">{item.glyph}</span>
              {item.label}
            </div>
          ))}
        </div>

        <div className="studio-mock__canvas">
          <div className="studio-mock__canvas-head">
            <span className="studio-mock__label">工作流画布</span>
            <span className="studio-mock__chip">+ on: push</span>
          </div>
          {[
            { no: 1, name: 'Checkout 代码', meta: 'actions/checkout@v4', done: true },
            { no: 2, name: '安装 Node.js', meta: 'actions/setup-node@v4' },
            { no: 3, name: '运行构建与测试', meta: 'run: npm run build' },
            { no: 4, name: '部署到 Production', meta: 'deploy / vercel', active: true },
          ].map((step) => (
            <div
              className={`studio-mock__step${step.active ? ' studio-mock__step--active' : ''}`}
              key={step.no}
            >
              <span className="studio-mock__step-no">{step.no}</span>
              <span className="studio-mock__step-text">
                <strong>{step.name}</strong>
                <small>{step.meta}</small>
              </span>
              {step.done ? <CheckIcon /> : null}
            </div>
          ))}
          <div className="studio-mock__add">+ 插入积木或点击添加步骤</div>
        </div>

        <div className="studio-mock__yaml">
          <div className="studio-mock__yaml-head">
            <span className="studio-mock__label">生成的 YAML</span>
            <CopyIcon />
          </div>
          <CodeLines lines={HERO_YAML} className="code-lines--compact" />
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="get-started">
      <div className="hero__copy">
        <span className="hero__badge">
          <i />
          开源新品 · 可视化编辑 GitHub Actions
        </span>
        <h1>
          <span>用积木搭出</span>
          <span>你的 CI/CD 流水线</span>
        </h1>
        <p>
          FlowForge 把复杂的 Actions 语法变成可视化积木。拖拽、连接、配置，实时生成标准 YAML ——
          零语法负担，所见即所得。
        </p>
        <div className="hero__actions">
          <a className="landing__button landing__button--primary" href={WORKSPACE_HREF}>
            免费开始搭建
          </a>
          <a className="landing__button landing__button--ghost" href="#how-it-works">
            <PlayIcon /> 看 90 秒演示
          </a>
        </div>
        <div className="hero__trust">
          <CheckIcon /> 开源免费 · 无需信用卡 · 30 秒生成第一个 workflow
        </div>
      </div>
      <div className="hero__visual">
        <StudioMock />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="landing-section how" id="how-it-works">
      <div className="landing-section__head">
        <span className="eyebrow">HOW IT WORKS</span>
        <h2>三步，从想法到流水线</h2>
        <p>不需要记住任何 Actions 语法。所见即所得的编排体验，让每个人都能搭建专业的 CI/CD。</p>
      </div>
      <div className="how__grid">
        {STEPS.map((step) => (
          <article className="how__card" key={step.no}>
            <span className="how__no">{step.no}</span>
            <span className="how__glyph" aria-hidden="true">
              {step.glyph}
            </span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeatureHeading({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="feature__copy">
      <span className="eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="feature__list">
        {items.map((item) => (
          <li key={item}>
            <CheckIcon />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowGraph() {
  return (
    <div className="flow-graph" role="img" aria-label="工作流编排流程图预览">
      <svg
        className="flow-graph__links"
        viewBox="0 0 520 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker id="flow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#34445c" />
          </marker>
          <marker
            id="flow-arrow-active"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#39d98a" />
          </marker>
        </defs>
        <path d="M110 65 H140" markerEnd="url(#flow-arrow)" />
        <path
          className="flow-graph__link--active"
          d="M240 65 H270"
          markerEnd="url(#flow-arrow-active)"
        />
        <path d="M370 65 H400" markerEnd="url(#flow-arrow)" />
        <path d="M190 92 V144" markerEnd="url(#flow-arrow)" />
        <path d="M240 171 H270" markerEnd="url(#flow-arrow)" />
        <path d="M370 171 H400" markerEnd="url(#flow-arrow)" />
        <path d="M110 277 H125 V190 H140" markerEnd="url(#flow-arrow)" />
        <path d="M320 198 V250" markerEnd="url(#flow-arrow)" />
        <path d="M370 277 H385 V198 H400" markerEnd="url(#flow-arrow)" />
      </svg>
      {GRAPH_NODES.map((node) => (
        <div
          className={`flow-graph__node${node.active ? ' flow-graph__node--active' : ''}`}
          style={{ left: node.left, top: node.top }}
          key={node.id}
        >
          <span className="flow-graph__glyph">{node.glyph}</span>
          <span className="flow-graph__node-text">
            <strong>{node.title}</strong>
            <small>{node.meta}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function TemplateGallery() {
  return (
    <div className="template-gallery" role="img" aria-label="工作流模板库预览">
      <div className="template-gallery__tabs">
        {['All', 'Automation', 'Repository', 'CI/CD', 'API', 'Recording'].map((tab, index) => (
          <span className={`template-gallery__tab${index === 3 ? ' is-active' : ''}`} key={tab}>
            {tab}
          </span>
        ))}
      </div>
      <div className="template-gallery__grid">
        {TEMPLATES.map((template) => (
          <article
            className={`template-card${template.active ? ' template-card--active' : ''}`}
            key={template.title}
          >
            <span className="template-card__glyph">{template.glyph}</span>
            <strong>{template.title}</strong>
            <small>{template.subtitle}</small>
            <p>{template.description}</p>
          </article>
        ))}
      </div>
      <div className="template-gallery__footer">
        <span>Sort by: Recent ▾</span>
        <span>View: Grid ◫</span>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="landing-section features" id="features">
      <div className="landing-section__head">
        <span className="eyebrow">CORE FEATURES</span>
        <h2>把复杂留给我们，把掌控感还给你</h2>
        <p>从可视化编排到团队协作，FlowForge 覆盖构建自动化工作流所需的一切。</p>
      </div>

      <div className="feature-row">
        <FeatureHeading
          eyebrow="可视化编排"
          title="画布即代码，所见即所得"
          description="拖拽积木、连线定义依赖，复杂的工作流逻辑在画布上一目了然。每一步的参数都可通过表单直接配置，不用再与语法较劲。"
          items={['40+ 官方与社区 Action 积木库', '条件分支、矩阵构建、并行任务']}
        />
        <FlowGraph />
      </div>

      <div className="feature-row feature-row--reverse">
        <div className="code-panel">
          <div className="code-panel__head">
            <i />
            <i />
            <i />
            <span className="code-panel__filename">workflow.yml</span>
          </div>
          <CodeLines lines={FEATURE_YAML} />
        </div>
        <FeatureHeading
          eyebrow="YAML 实时预览"
          title="每一次改动，即时同步为标准 YAML"
          description="画布与代码双向同步。你可以随时切换到 YAML 视图微调，改动会立即反映回画布，生成结果符合 GitHub Actions 官方规范。"
          items={['语法高亮与实时校验，错误即时提示', '复制即用的规范 workflow 文件']}
        />
      </div>

      <div className="feature-row">
        <FeatureHeading
          eyebrow="模板与团队协作"
          title="从模板起步，与团队共享最佳实践"
          description="内置常见场景的工作流模板，一键套用。把搭建好的流水线保存为团队模板，版本化管理，让最佳实践在团队内流转。"
          items={['CI/CD、测试、发布等场景模板', '团队共享、版本历史与权限管理']}
        />
        <TemplateGallery />
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__main">
        <div className="landing-footer__brand">
          <a className="landing__brand" href="#/">
            <span className="landing__brand-mark">
              <LogoIcon />
            </span>
            <span>FlowForge</span>
          </a>
          <p>用积木搭建自动化，让每个人都能定义自己的 CI/CD。</p>
        </div>
        <div className="landing-footer__links">
          {FOOTER_COLUMNS.map((column) => (
            <div className="landing-footer__column" key={column.title}>
              <strong>{column.title}</strong>
              {column.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...('external' in link && link.external
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="landing-footer__bottom">
        <span>© 2026 FlowForge · 开源项目 · 遵循 MIT 协议</span>
        <span className="landing-footer__status">
          <i />
          所有服务运行正常
        </span>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="landing">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
      </main>
      <div className="landing__divider" />
      <SiteFooter />
    </div>
  );
}
