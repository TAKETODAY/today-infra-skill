#!/usr/bin/env node
/**
 * 从 today-infrastructure 的 infra-docs asciidoc 中抽取结构化页面模型。
 *
 * 输出 data/pages.json：
 *   [{ path, module, title, sections: [{ level, title, id, prose, blocks: [{lang, code}] }] }]
 *
 * 用法：
 *   node scripts/extract.mjs [--docs <infra-docs 路径>] [--out <输出路径>]
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const DOCS = arg('--docs', '/Users/today/git/today-tech/today-infrastructure/infra-docs');
const OUT = arg('--out', join(ROOT, 'data/pages.json'));

/** 文档模块：只取对外文档，api 模块是 Java API 索引，跳过。 */
const MODULES = ['ROOT', 'application', 'gradle-plugin', 'tutorial'];

/** 这些语言是纯输出/日志，对“怎么写代码”没有指导价值。 */
const SKIP_LANGS = new Set(['text', 'logging', 'literal', 'APIDOC', 'asciidoc']);

/**
 * antora 内置/未在 antora.yml 声明的属性，直接给可读值。
 * `ifeval::` 条件块在构建时求值，这里保留内容、删掉指令行。
 */
const BUILTIN_ATTRS = {
  asterisk: '*',
  'api-documentation': 'API 文档',
  'dependency-management-plugin': 'io.spring.dependency-management',
  'gradle-dsl': 'Gradle DSL',
};
/** asciidoc 属性表里这些值会出现在正文，输出前替换成实际文本。 */
function loadAttributes() {
  const file = join(DOCS, 'antora.yml');
  const attrs = {};
  let inAttrs = false;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (/^asciidoc:\s*$/.test(line)) { inAttrs = true; continue; }
    if (inAttrs && /^\S/.test(line)) { inAttrs = false; }
    if (!inAttrs) continue;
    const m = line.match(/^\s{4,}([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
      v = v.slice(1, -1);
    }
    attrs[m[1]] = v;
  }
  return { ...BUILTIN_ATTRS, ...attrs };
}

/** 属性值可能互相引用，做两轮展开。 */
function expandAttrs(attrs) {
  const out = { ...attrs };
  for (let round = 0; round < 3; round++) {
    let changed = false;
    for (const [k, v] of Object.entries(out)) {
      const next = v.replace(/\{([A-Za-z0-9_-]+)\}/g, (all, name) =>
        out[name] !== undefined && out[name] !== v ? out[name] : all);
      if (next !== v) { out[k] = next; changed = true; }
    }
    if (!changed) break;
  }
  return out;
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (extname(name) === '.adoc' && !name.startsWith('nav-') && !name.includes('partial$')) acc.push(full);
  }
  return acc;
}

function stripInline(text) {
  return text
    .replace(/\{([A-Za-z0-9_-]+)\}/g, (all, n) => ATTRS[n] ?? all)
    .replace(/xref:[^\[]*\[([^\]]*)\]/g, '$1')
    .replace(/https?:\/\/[^\s\[]+\[([^\]]*)\]/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\+\+([^+]*)\+\+/g, '$1')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 解析 [source,lang,...] / [source,lang] / [,lang] 标记。 */
function parseSourceMarker(line) {
  const m = line.match(/^\[(?:source)?,([A-Za-z0-9_+-]+)(?:,[^\]]*)?\]$/);
  if (m) return m[1].toLowerCase();
  const short = line.match(/^\[([a-z][a-z0-9_+-]+)\]$/);
  if (short) return short[1].toLowerCase();
  return null;
}

function looksLikeLog(code) {
  const lines = code.split('\n').filter(l => l.trim());
  if (!lines.length) return true;
  const logLines = lines.filter(l =>
    /^\[[A-Za-z]+\]/.test(l.trim()) ||
    /^\d{4}-\d{2}-\d{2}/.test(l.trim()) ||
    /\b(INFO|DEBUG|WARN|ERROR|TRACE)\b/.test(l) && /^[A-Z]/.test(l.trim()));
  return logLines.length / lines.length > 0.6;
}

function parsePage(file, moduleName) {
  const raw = readFileSync(file, 'utf8');
  // 去掉条件指令行，保留其内容（本仓库文档实际按 release 分支输出）
  const lines = raw.split('\n').filter(l => !/^\s*(ifeval|endif)::/.test(l));
  const page = {
    path: relative(DOCS, file).replace(/\\/g, '/'),
    module: moduleName,
    title: '',
    sections: [],
  };
  let current = { level: 0, title: '(intro)', id: '', prose: [], blocks: [] };
  page.sections.push(current);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!page.title) {
      const h = line.match(/^=\s+(.+)$/);
      if (h) { page.title = stripInline(h[1]); continue; }
    }

    const anchor = line.match(/^\[\[([^\]]+)\]\]$/);
    if (anchor) { current.id = anchor[1]; continue; }

    const heading = line.match(/^(={2,5})\s+(.+)$/);
    if (heading) {
      current = { level: heading[1].length, title: stripInline(heading[2]), id: '', prose: [], blocks: [] };
      page.sections.push(current);
      continue;
    }

    // 代码块：标记行 + ---- 围栏
    const lang = parseSourceMarker(line);
    if (lang && lines[i + 1]?.trim() === '----') {
      const start = i + 2;
      let end = start;
      while (end < lines.length && lines[end].trim() !== '----') end++;
      const code = lines.slice(start, end).join('\n').trimEnd();
      if (code && !SKIP_LANGS.has(lang) && !looksLikeLog(code)) {
        current.blocks.push({ lang, code });
      }
      i = end;
      continue;
    }

    // tabs 块：====== ... ======，内部含 source 块；直接递归解析内部即可
    if (line.trim() === '[tabs]' && lines[i + 1]?.trim() === '======') {
      const end = lines.indexOf('======', i + 2);
      if (end > -1) {
        const inner = lines.slice(i + 2, end);
        for (let j = 0; j < inner.length; j++) {
          const l = parseSourceMarker(inner[j]);
          if (l && inner[j + 1]?.trim() === '----') {
            const s = j + 2;
            let e = s;
            while (e < inner.length && inner[e].trim() !== '----') e++;
            const code = inner.slice(s, e).join('\n').trimEnd();
            if (code && !SKIP_LANGS.has(l) && !looksLikeLog(code)) {
              current.blocks.push({ lang: l, code });
            }
            j = e;
          }
        }
        i = end;
        continue;
      }
    }

    // 正文摘要：小节标题后、第一个代码块前的普通段落
    if (!current.blocks.length && line.trim() && !/^(\*|\.|\|+|\[|:|-{3,}|={3,}|<|\/\/|include::|\s*$)/.test(line)) {
      if (/^\s/.test(line)) continue; // 列表续行
      current.prose.push(stripInline(line));
    }
  }

  page.sections = page.sections
    .map(s => ({ ...s, prose: s.prose.join(' ').slice(0, 400) }))
    .filter(s => s.blocks.length || s.level === 0);
  return page;
}

const ATTRS = expandAttrs(loadAttributes());
const pages = [];
for (const mod of MODULES) {
  const dir = join(DOCS, 'modules', mod, 'pages');
  for (const file of walk(dir)) {
    const page = parsePage(file, mod);
    if (page.title) pages.push(page);
  }
}

pages.sort((a, b) => a.path.localeCompare(b.path));
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(pages, null, 2));

const withBlocks = pages.filter(p => p.sections.some(s => s.blocks.length));
const blockCount = pages.reduce((n, p) => n + p.sections.reduce((m, s) => m + s.blocks.length, 0), 0);
console.log(`页面 ${pages.length}，含代码块 ${withBlocks.length}，代码块 ${blockCount} → ${relative(ROOT, OUT)}`);
