#!/usr/bin/env node
/**
 * 用 data/pages.json + data/topics.json 生成 skills/infra-app-dev/references/*.md。
 *
 * 设计目标：references 是“导航 + 关键示例”，不是全量重排文档。每页保留标题、
 * 小节、精简正文与最关键的代码块，并标注 infra-docs 原文路径，便于深挖。
 *
 * 用法：
 *   node scripts/extract.mjs && node scripts/build-refs.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = JSON.parse(readFileSync(join(ROOT, 'data/pages.json'), 'utf8'));
const TOPICS = JSON.parse(readFileSync(join(ROOT, 'data/topics.json'), 'utf8'));
const OUT_DIR = join(ROOT, 'skills/infra-app-dev/references');

/** 每小节最多 1 个、每页最多 2 个示例：保证长文档里靠后的页面也能被覆盖到。 */
const MAX_BLOCKS_PER_PAGE = 2;
const GITHUB_DOCS = 'https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs';

/** 把内部路径转成 asciidoc 模块路径：ROOT 省略前缀，其他模块用 `module:path`。 */
function docId(path) {
  const m = path.match(/^modules\/([^/]+)\/pages\/(.+)\.adoc$/);
  if (!m) return path;
  return m[1] === 'ROOT' ? m[2] : `${m[1]}:${m[2]}`;
}

/** 每个主题收集命中的页面（按 path 排序，保持文档原有顺序大致稳定）。 */
function collect(topic) {
  const seen = new Set();
  const hits = [];
  for (const prefix of topic.match) {
    for (const page of PAGES) {
      if (seen.has(page.path)) continue;
      if (page.path.startsWith(prefix)) { seen.add(page.path); hits.push(page); }
    }
  }
  return hits;
}

function fence(code, lang) {
  const safe = code.replace(/```/g, "'''");
  return '```' + lang + '\n' + safe + '\n```';
}

function truncate(code, maxLines) {
  const lines = code.split('\n');
  if (lines.length <= maxLines) return { code, cut: false };
  return { code: lines.slice(0, maxLines).join('\n') + '\n// ... 省略，完整示例见原文', cut: true };
}

/** 标题层级映射：页面用 ##，小节从 #### 起，避免与页面级冲突。 */
function heading(level, title) {
  return '#'.repeat(Math.min(5, Math.max(4, level + 2))) + ' ' + title;
}

function render(topic) {
  const pages = collect(topic);
  const out = [];
  out.push(`# ${topic.title}`);
  out.push('');
  out.push('> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。');
  out.push('');
  out.push(topic.summary);
  out.push('');

  const pagesWithBlocks = pages.filter(p => p.sections.some(s => s.blocks.length));
  out.push(`覆盖文档：${pages.length} 页（含示例 ${pagesWithBlocks.length} 页）。原文位于仓库 \`infra-docs/\`，下方每个页面标注了路径。`);
  out.push('');

  // 目录
  out.push('## 页面索引');
  out.push('');
  for (const p of pages) {
    const hasBlocks = p.sections.some(s => s.blocks.length);
    const id = docId(p.path);
    out.push(`- ${hasBlocks ? '**' : ''}${p.title || id}${hasBlocks ? '**' : ''} —— \`${id}\``);
  }
  out.push('');

  let blocks = 0;
  let truncated = false;

  for (const page of pages) {
    let pageBlocks = 0;
    const docPath = docId(page.path);
    out.push(`## ${page.title}`);
    out.push('');
    out.push(`> 原文：[\`${docPath}\`](${GITHUB_DOCS}/${page.path})`);
    out.push('');

    for (const section of page.sections) {
      if (!section.blocks.length && section.level > 0) continue;
      if (section.level > 0) out.push(heading(section.level, section.title));
      else out.push('### 概述');
      out.push('');

      if (section.prose) {
        out.push(section.prose);
        out.push('');
      }

      // 每小节最多 1 个、每页最多 2 个示例：保证长文档里靠后的页面也能被覆盖到。
      let perSection = 0;
      for (const block of section.blocks) {
        if (perSection >= 1 || pageBlocks >= MAX_BLOCKS_PER_PAGE) { truncated = true; break; }
        if (blocks >= TOPICS.maxBlocksPerFile) { truncated = true; break; }
        const { code, cut } = truncate(block.code, TOPICS.maxLinesPerBlock);
        out.push(fence(code, block.lang));
        out.push('');
        blocks++;
        perSection++;
        pageBlocks++;
        if (cut) truncated = true;
      }
      if (blocks >= TOPICS.maxBlocksPerFile) break;
    }

    if (blocks >= TOPICS.maxBlocksPerFile) break;
  }

  if (truncated) {
    out.push('---');
    out.push('');
    out.push(`> 本文件已达到 ${TOPICS.maxBlocksPerFile} 个示例的上限，其余内容请在 \`infra-docs/\` 原文查阅。`);
    out.push('');
  }

  return { content: out.join('\n'), pageCount: pages.length, blockCount: blocks };
}

mkdirSync(OUT_DIR, { recursive: true });
// 清理已改名的旧产物，保留其他脚本生成的文件。
const generated = new Set(TOPICS.topics.map(t => t.file));
const keep = new Set(['project-files.md', 'starters.md']);
for (const name of readdirSync(OUT_DIR)) {
  if (!name.endsWith('.md') || name === 'INDEX.md' || keep.has(name) || generated.has(name)) continue;
  unlinkSync(join(OUT_DIR, name));
}
const stats = [];
for (const topic of TOPICS.topics) {
  const { content, pageCount, blockCount } = render(topic);
  writeFileSync(join(OUT_DIR, topic.file), content);
  stats.push({ file: topic.file, pageCount, blockCount, lines: content.split('\n').length });
}

/** 生成一个总索引，供 SKILL.md 引用。 */const index = [
  '# 参考文档索引',
  '',
  '> 自动生成，请勿手工编辑。',
  '',
  '| 文件 | 文档页 | 代码示例 | 规模 |',
  '|---|---|---|---|',
];
for (const s of stats.sort((a, b) => a.file.localeCompare(b.file))) {
  index.push(`| \`references/${s.file}\` | ${s.pageCount} 页 | ${s.blockCount} 个示例 | ${s.lines} 行 |`);
}
writeFileSync(join(OUT_DIR, 'INDEX.md'), index.join('\n'));

for (const s of stats) {
  console.log(`${s.file.padEnd(28)} 页面 ${String(s.pageCount).padStart(3)}  示例 ${String(s.blockCount).padStart(3)}  行 ${s.lines}`);
}

/**
 * 生成 api-index.md：注解、全限定类名 → 出现它们的文档页。
 * 只收录出现 2 次以上的名字，避免一次性示例污染索引。
 */
function buildApiIndex() {
  const annotations = new Map(); // name -> Set<docId>
  const classes = new Map();

  const add = (map, name, id) => {
    if (!map.has(name)) map.set(name, new Set());
    map.get(name).add(id);
  };

  for (const page of PAGES) {
    const id = docId(page.path);
    for (const section of page.sections) {
      const text = [section.prose, ...section.blocks.map(b => b.code)].join('\n');
      for (const m of text.matchAll(/@([A-Z][A-Za-z0-9]+)/g)) add(annotations, m[1], id);
      for (const m of text.matchAll(/\binfra\.[a-z0-9.]+\.([A-Z][A-Za-z0-9]+)/g)) add(classes, m[1], id);
    }
  }

  const render = (map, title, note) => {
    const rows = [...map.entries()]
      .filter(([, pages]) => pages.size >= 2)
      .sort((a, b) => a[0].localeCompare(b[0]));
    const out = [`## ${title}`, '', note, ''];
    for (const [name, pages] of rows) {
      const sorted = [...pages].sort();
      const shown = sorted.length > 8
        ? sorted.slice(0, 6).map(p => `\`${p}\``).join('、') + ` …（共 ${sorted.length} 页）`
        : sorted.map(p => `\`${p}\``).join('、');
      out.push(`- \`${name}\` —— ${shown}`);
    }
    out.push('');
    return out.join('\n');
  };

  const content = [
    '# API 速查索引',
    '',
    '> 自动生成，请勿手工编辑。用于把注解/类名反查到对应文档页。',
    '',
    render(annotations, '注解', '框架注解及使用它们的文档页：'),
    render(classes, '类名', '全限定名中出现过的框架类及对应文档页：'),
  ].join('\n');

  writeFileSync(join(OUT_DIR, 'api-index.md'), content);
  return content.split('\n').length;
}

const apiLines = buildApiIndex();
console.log(`${'api-index.md'.padEnd(28)} 注解/类名索引 ${apiLines} 行`);
