#!/usr/bin/env node
/**
 * 从 today-infrastructure 的 settings.gradle + 各 starter 的 build.gradle 生成：
 *   skills/infra-app-dev/references/starters.md  —— starter 选择表
 *   FRAMEWORK_VERSION                            —— 文档对应的框架版本
 *
 * 用法：
 *   node scripts/build-modules.mjs [--repo <today-infrastructure 路径>]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const REPO = arg('--repo', '/Users/today/git/today-tech/today-infrastructure');
const STARTER_DIR = join(REPO, 'infra-starter');

/** 用途分组：按 starter 名（去掉 infra-starter- 前缀）匹配，剩余归入“其他”。 */
const GROUPS = [
  ['应用启动与日志', ['application', 'logback', 'logging']],
  ['Web MVC 与服务器', ['webmvc', 'webmvc-test', 'websocket', 'netty-server']],
  ['Web API 与响应式', ['web', 'webclient', 'reactor-netty', 'reactor-server']],
  ['HTTP 客户端', ['restclient', 'restclient-test', 'http-service']],
  ['数据访问', ['jdbc', 'jdbc-test', 'sql', 'persistence', 'transaction']],
  ['序列化', ['jackson', 'gson', 'json', 'jsonb']],
  ['模板与邮件', ['freemarker', 'groovy-templates', 'mail']],
  ['校验与 AOP', ['validation', 'aspectj']],
  ['测试', ['test']],
  ['数据库迁移', ['flyway']],
];

function describe(dir) {
  const buildFile = join(dir, 'build.gradle');
  if (!existsSync(buildFile)) return '';
  const m = readFileSync(buildFile, 'utf8').match(/^\s*description\s*=\s*['"]([^'"]+)['"]/m);
  return m ? m[1] : '';
}

const starters = [];
for (const name of readdirSync(STARTER_DIR)) {
  const dir = join(STARTER_DIR, name);
  if (!name.startsWith('infra-starter-') || !existsSync(dir)) continue;
  starters.push({ name, short: name.replace(/^infra-starter-/, ''), desc: describe(dir) });
}
starters.sort((a, b) => a.name.localeCompare(b.name));

const used = new Set();
const sections = [];
for (const [title, names] of GROUPS) {
  const list = starters.filter(s => names.includes(s.short));
  for (const s of list) used.add(s.name);
  if (list.length) sections.push([title, list]);
}
const rest = starters.filter(s => !used.has(s.name));
if (rest.length) sections.push(['其他', rest]);

const version = readFileSync(join(REPO, 'gradle.properties'), 'utf8').match(/^version=(.+)$/m)?.[1] ?? 'unknown';
const out = [
  '# Starter 选择表',
  '',
  '> 由 `scripts/build-modules.mjs` 从 `today-infrastructure` 的 starter 模块生成，请勿手工编辑。',
  `> 生成时框架版本：\`${version}\``,
  '',
  '只引需要的 starter。坐标为 `cn.taketoday:<模块名>`，版本由 BOM 或 `infra-dependencies` 管理。',
  '',
];

for (const [title, list] of sections) {
  out.push(`## ${title}`, '', '| Starter | 说明 |', '|---|---|');
  for (const s of list) out.push(`| \`${s.name}\` | ${s.desc || '—'} |`);
  out.push('');
}

writeFileSync(join(ROOT, 'skills/infra-app-dev/references/starters.md'), out.join('\n'));
writeFileSync(join(ROOT, 'FRAMEWORK_VERSION'), version + '\n');
console.log(`starter ${starters.length} 个，版本 ${version}`);
