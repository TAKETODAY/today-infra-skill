# TODAY Infrastructure · 应用开发 Skill

一个 OpenCode skill：教 AI 编码代理**如何用 TODAY Infrastructure 写应用**。

面向公开：只包含框架使用者需要的内容（建工程、控制器、依赖注入、事务、JDBC、测试、Gradle 插件），不包含仓库内部的维护约定。

| Skill | 用途 |
|---|---|
| `infra-app-dev` | 用 TODAY Infrastructure 写业务应用 |

仓库自身的开发约定（版权头、移植流程、提交与发版）不在本 skill 范围内。

## 安装

```bash
./install.sh
```

创建软链接：

```
~/.config/opencode/skills/infra-app-dev -> <repo>/skills/infra-app-dev
```

可用 `OPENCODE_SKILLS_DIR` 覆盖目标目录。卸载：`./install.sh --uninstall`。

## 内容怎么来的

`references/` 由脚本从 **`today-infrastructure` 仓库的 `infra-docs` asciidoc 原文**抽取生成，而不是手工摘抄：

```
data/topics.json          人工维护的主题归类规则（路径前缀 → reference 文件）
data/llms.txt             context7 llms.txt 快照（用于补齐 infra-docs 未覆盖的仓库根文件）
data/pages.json           抽取的中间产物（不提交）

scripts/extract.mjs       infra-docs/*.adoc → data/pages.json
scripts/build-refs.mjs    pages.json + topics.json → references/*.md
scripts/build-modules.mjs starter 模块 → references/starters.md + FRAMEWORK_VERSION
scripts/sync-context7.mjs 拉 llms.txt → references/project-files.md（只保留 adoc 未覆盖的部分）
scripts/verify.mjs        校验引用、文档路径、代码围栏、属性占位符
```

### 为什么以 asciidoc 为主

context7 的 `llms.txt` 是对文档代码块的二次抽取，存在三个问题：大量纯输出/日志片段、Spring 遗留占位示例（如 `x.y.service`）、缺少上下文的小节标题。直接当作 skill 内容会把噪音变成“权威”。

因此 references 的正文来自 `infra-docs` 原文（含小节标题与说明），`llms.txt` 只用于补齐 README、CONTRIBUTING、`infra-samples` 这类 adoc 之外的仓库文件，并在生成时过滤输出类和占位片段。

## 更新

框架文档变更后重新生成：

```bash
./scripts/update.sh            # 在线拉取 llms.txt
./scripts/update.sh --offline  # 用本地快照
```

等价于：

```bash
node scripts/extract.mjs
node scripts/build-refs.mjs
node scripts/build-modules.mjs
node scripts/sync-context7.mjs
node scripts/verify.mjs
```

仓库默认假定 `today-infrastructure` 与本仓库同级（`../today-infrastructure`）。其他位置用参数覆盖：

```bash
node scripts/extract.mjs --docs /path/to/today-infrastructure/infra-docs
node scripts/build-modules.mjs --repo /path/to/today-infrastructure
```

`FRAMEWORK_VERSION` 记录生成时的框架版本，便于判断是否需要重新同步。

## 目录

```
skills/infra-app-dev/
├── SKILL.md                      路由、最小应用、与 Spring 的对照、任务表
└── references/                   按主题拆分的 API 速查（自动生成）
    ├── bootstrap.md              工程搭建、Gradle 插件、启动、打包
    ├── starters.md               starter 选择表
    ├── core-container.md         Bean、注入、作用域、生命周期
    ├── core-runtime.md           资源、日志、空值安全、AOT
    ├── core-aop.md               切面、通知、切点、代理
    ├── core-expression.md        SpEL
    ├── core-validation.md        校验与类型转换
    ├── web-mvc.md                控制器、参数、返回值、异常、MVC 配置
    ├── web-mvc-advanced.md       函数式端点、CORS、视图、REST 客户端
    ├── web-session-websocket.md  会话与 WebSocket
    ├── data-access.md            JdbcTemplate、行映射
    ├── transaction.md            声明式/编程式事务
    ├── persistence.md            实体映射、分页、审计
    ├── testing-context.md        @InfraTest、上下文、事务测试
    ├── testing-mvc.md            MockMvc、WebTestClient
    ├── integration.md            缓存、调度、邮件、JMX
    ├── api-index.md              注解/类名 → 文档页
    └── project-files.md          README/CONTRIBUTING/示例补漏
```

## 维护原则

1. **references 不要手工改**。它们由脚本覆盖；调整归类改 `data/topics.json`，调整抽取规则改 `scripts/`。
2. **`SKILL.md` 手工维护**。新增能力先考虑放进 `references` 的某个主题，而不是继续拉长路由文件。
3. **改完跑 `node scripts/verify.mjs`**：检查引用的 reference 是否存在、文档 id 是否真实、代码围栏是否闭合。
4. **不自动提交**。生成产物与规则改动一起提交，提交信息用 Gitmoji + 中文。
5. **本仓库面向公开**：只写框架使用者需要的内容，内部流程、未发布决策不应写进来。
