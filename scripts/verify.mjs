#!/usr/bin/env node
/**
 * 校验 skill 产物的一致性：
 *   1. SKILL.md 里引用的 references 文件都存在；
 *   2. references 里标注的文档 id 在 infra-docs 中真实存在；
 *   3. 每个 reference 的代码围栏成对闭合；
 *   4. 没有残留的 asciidoc 属性占位符（{xxx}）。
 *
 * 用法：
 *   node scripts/verify.mjs [--docs <infra-docs 路径>] [--strict]
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const i = process.argv.indexOf('--docs');
const DOCS = i > -1 ? process.argv[i + 1] : '/Users/today/git/today-tech/today-infrastructure/infra-docs';

const errors = [];
const warnings = [];

function walk(dir, filter, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, filter, acc);
    else if (filter(name)) acc.push(full);
  }
  return acc;
}

/** 收集所有 skill 的 SKILL.md。 */
const skillFiles = walk(join(ROOT, 'skills'), n => n === 'SKILL.md');
if (skillFiles.length === 0) errors.push('没有找到任何 SKILL.md');

for (const skill of skillFiles) {
  const dir = dirname(skill);
  const text = readFileSync(skill, 'utf8');
  const rel = relative(ROOT, skill);

  if (!text.startsWith('---')) errors.push(`${rel}: 缺少 YAML frontmatter`);
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) errors.push(`${rel}: frontmatter 未闭合`);
  else {
    if (!/^name:\s*\S+/m.test(fm[1])) errors.push(`${rel}: frontmatter 缺少 name`);
    if (!/^description:\s*\S+/m.test(fm[1])) errors.push(`${rel}: frontmatter 缺少 description`);
  }

  // 引用的 references 必须存在：支持同目录 `references/x.md` 与跨 skill `skills/other/references/x.md`
  for (const m of text.matchAll(/`?(?:(skills\/[A-Za-z0-9._-]+)\/)?references\/([A-Za-z0-9._-]+\.md)`?/g)) {
    const target = m[1] ? join(ROOT, m[1], 'references', m[2]) : join(dir, 'references', m[2]);
    if (!existsSync(target)) errors.push(`${rel}: 引用了不存在的 ${m[0]}`);
  }
}

/** 收集所有 reference 文件并校验。 */
const refs = walk(join(ROOT, 'skills'), n => n.endsWith('.md') && n !== 'SKILL.md');
for (const file of refs) {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, 'utf8');

  // 代码围栏
  const fences = (text.match(/^```/gm) || []).length;
  if (fences % 2 !== 0) errors.push(`${rel}: 代码围栏数量为奇数（${fences}），存在未闭合块`);

  // asciidoc 属性占位符残留：只检查代码块之外的正文
  const prose = text.replace(/```[\s\S]*?```/g, '');
  for (const m of prose.matchAll(/(?<![$\\])\{[a-z][a-z0-9-]+\}/g)) {
    if (['{0}', '{1}', '{2}'].includes(m[0])) continue;
    warnings.push(`${rel}: 正文残留 asciidoc 占位符 ${m[0]}`);
  }

  // 文档 id 必须能在 infra-docs 找到（只校验 generated 文件里有 `原文：` 链接的）
  for (const m of text.matchAll(/原文：\[`([^`]+)`\]/g)) {
    const id = m[1];
    const [module, path] = id.includes(':') ? id.split(':') : ['ROOT', id];
    const adoc = join(DOCS, 'modules', module, 'pages', path + '.adoc');
    if (!existsSync(adoc)) errors.push(`${rel}: 文档 id \`${id}\` 在 infra-docs 中不存在`);
  }
}

// 文件规模提示
for (const file of refs) {
  const lines = readFileSync(file, 'utf8').split('\n').length;
  if (lines > 2000) warnings.push(`${relative(ROOT, file)}: ${lines} 行，偏大，考虑拆分主题`);
}

const print = (title, list) => {
  if (!list.length) return;
  console.log(`\n${title}（${list.length}）`);
  for (const item of list.slice(0, 40)) console.log(`  - ${item}`);
  if (list.length > 40) console.log(`  … 还有 ${list.length - 40} 条`);
};

print('错误', errors);
print('警告', warnings);

console.log(`\n检查 ${skillFiles.length} 个 SKILL.md、${refs.length} 个 reference 文件。`);
if (errors.length) {
  console.log(`失败：${errors.length} 个错误`);
  process.exit(1);
}
console.log(STRICT && warnings.length ? `通过，但有 ${warnings.length} 个警告` : '通过');
