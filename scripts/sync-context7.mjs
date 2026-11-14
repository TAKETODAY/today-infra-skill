#!/usr/bin/env node
/**
 * 拉取 context7 生成的 llms.txt 快照，并抽取 adoc 未覆盖的内容
 * （README / CONTRIBUTING / infra-samples 等仓库根文件）。
 *
 * 输出：
 *   data/llms.txt                              —— 原始快照，便于对比
 *   skills/infra-app-dev/references/project-files.md —— llms.txt 独有片段（过滤噪音后）
 *
 * 用法：
 *   node scripts/sync-context7.mjs [--url <llms.txt>] [--offline]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_ = 'https://context7.com/taketoday/today-infrastructure/llms.txt';
const RAW = join(ROOT, 'data/llms.txt');
const OUT = join(ROOT, 'skills/infra-app-dev/references/project-files.md');

/** 这些语言是纯输出/占位，对写代码没有指导价值。 */
const SKIP_LANGS = new Set(['text', 'logging', 'APIDOC', 'literal', 'asciidoc']);
const SKIP_TITLE = /(^|\s)(output|输出|console|日志)(\s|$)/i;

function parse(raw) {
  const lines = raw.split('\n');
  const entries = [];
  let cur = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const title = line.match(/^###\s+(.+)$/);
    if (title) {
      if (cur) entries.push(cur);
      cur = { title: title[1].trim(), source: '', desc: '', blocks: [] };
      continue;
    }
    if (!cur) continue;

    const src = line.match(/^Source:\s*(\S+)$/);
    if (src) { cur.source = src[1]; continue; }

    const fence = line.match(/^```([A-Za-z0-9_+-]*)\s*$/);
    if (fence) {
      const lang = fence[1] || 'text';
      const start = i + 1;
      let end = start;
      while (end < lines.length && !/^```\s*$/.test(lines[end])) end++;
      cur.blocks.push({ lang, code: lines.slice(start, end).join('\n').trimEnd() });
      i = end;
      continue;
    }

    if (line.trim() && !cur.desc && cur.title) cur.desc = line.trim();
  }
  if (cur) entries.push(cur);
  return entries;
}

function repoPath(source) {
  const m = source.match(/today-infrastructure\/blob\/[^/]+\/(.+)$/);
  return m ? m[1] : '';
}

async function load() {
  if (process.argv.includes('--offline')) {
    if (!existsSync(RAW)) throw new Error('data/llms.txt 不存在，先在线运行一次');
    return readFileSync(RAW, 'utf8');
  }
  const res = await fetch(URL_);
  if (!res.ok) throw new Error(`下载失败: ${res.status}`);
  const text = await res.text();
  writeFileSync(RAW, text);
  return text;
}

const raw = await load();
const entries = parse(raw);

const kept = [];
const skipped = { docs: 0, noise: 0, empty: 0 };

for (const e of entries) {
  const path = repoPath(e.source);
  // infra-docs 的内容已由 extract + build-refs 从 asciidoc 原文抽取，更准确
  if (path.startsWith('infra-docs/')) { skipped.docs++; continue; }
  if (SKIP_TITLE.test(e.title)) { skipped.noise++; continue; }

  const blocks = e.blocks.filter(b => !SKIP_LANGS.has(b.lang) && b.code.trim());
  if (!blocks.length) { skipped.empty++; continue; }
  kept.push({ ...e, path: path || e.source, blocks });
}

// 去重：同一 source + 同一代码块只保留一次
const seen = new Set();
const unique = [];
for (const e of kept) {
  const key = e.path + '\n' + e.blocks.map(b => b.code).join('\n');
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(e);
}

const out = [
  '# 仓库根文件与示例片段',
  '',
  '> 由 `scripts/sync-context7.mjs` 从 context7 的 `llms.txt` 生成，请勿手工编辑。',
  '> 只保留 `infra-docs` 未覆盖的内容（README、CONTRIBUTING、infra-samples 等）；',
  '> 文档正文的权威来源仍是 `infra-docs`，本文件用于补齐“项目怎么跑起来”这类信息。',
  '',
  `条目 ${unique.length} 个（跳过：已在 infra-docs 覆盖 ${skipped.docs}、输出/占位 ${skipped.noise}、无代码 ${skipped.empty}）。`,
  '',
];

const bySource = new Map();
for (const e of unique) {
  if (!bySource.has(e.path)) bySource.set(e.path, []);
  bySource.get(e.path).push(e);
}

for (const [path, list] of [...bySource.entries()].sort()) {
  out.push(`## \`${path}\``, '');
  for (const e of list) {
    out.push(`### ${e.title}`, '');
    if (e.desc) { out.push(e.desc, ''); }
    for (const b of e.blocks) {
      out.push('```' + b.lang, b.code, '```', '');
    }
  }
}

writeFileSync(OUT, out.join('\n'));
console.log(`llms.txt 条目 ${entries.length}，保留 ${unique.length} → ${OUT.replace(ROOT + '/', '')}`);
