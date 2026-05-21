#!/usr/bin/env node

import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const contentDir = path.join(projectRoot, 'src/content/blog');
const assetsDir = path.join(projectRoot, 'src/assets');
const templateDir = path.join(__dirname, 'templates');

const argv = parseArgs(process.argv.slice(2));
const dryRun = Boolean(argv['dry-run']);
const baseMode = Boolean(argv.base || argv['base-only']);

const today = new Date().toISOString().slice(0, 10);
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

try {
  const slugInput = argv.slug ?? (await ask(rl, 'Base slug (kebab-case): '));
  const normalizedSlug = normalizeSlug(slugInput);

  const answers = {
    slug: normalizedSlug,
    titleEn: argv['title-en'] ?? (baseMode ? `TODO: ${titleFromSlug(normalizedSlug)} (EN)` : await ask(rl, 'English title: ')),
    titleEs: argv['title-es'] ?? (baseMode ? `TODO: ${titleFromSlug(normalizedSlug)} (ES)` : await ask(rl, 'Spanish title: ')),
    descriptionEn: argv['description-en'] ?? (baseMode ? 'TODO: Add English summary.' : await ask(rl, 'English description: ')),
    descriptionEs: argv['description-es'] ?? (baseMode ? 'TODO: Agrega resumen en espanol.' : await ask(rl, 'Spanish description: ')),
    asset: argv.asset ?? (baseMode ? '' : await ask(rl, 'Asset filename in src/assets (for example solid-cover.png): ')),
    pubDate: argv['pub-date'] ?? today,
  };

  validateAnswers(answers, { baseMode });

  if (answers.asset) {
    const assetPath = path.join(assetsDir, answers.asset);
    await access(assetPath);
  }

  const enFile = path.join(contentDir, `${answers.slug}.md`);
  const esFile = path.join(contentDir, `${answers.slug}-es.md`);
  const enTemplate = await loadTemplate('blog-post.en.md');
  const esTemplate = await loadTemplate('blog-post.es.md');

  await ensureWritableTarget(enFile);
  await ensureWritableTarget(esFile);
  await mkdir(contentDir, { recursive: true });

  const enContent = renderTemplate(enTemplate, {
    lang: 'en',
    title: answers.titleEn,
    description: answers.descriptionEn,
    slug: answers.slug,
    pubDate: answers.pubDate,
    asset: answers.asset,
    updatedDate: answers.pubDate,
  });

  const esContent = renderTemplate(esTemplate, {
    lang: 'es',
    title: answers.titleEs,
    description: answers.descriptionEs,
    slug: answers.slug,
    pubDate: answers.pubDate,
    asset: answers.asset,
    updatedDate: answers.pubDate,
  });

  if (dryRun) {
    process.stdout.write(`\nWould create:\n- ${path.relative(projectRoot, enFile)}\n- ${path.relative(projectRoot, esFile)}\n`);
    process.stdout.write(`\nHero image: ${answers.asset ? `../../assets/${answers.asset}` : '(not set in base mode)'}\n`);
    process.stdout.write(`\nEnglish title: ${answers.titleEn}\nSpanish title: ${answers.titleEs}\n`);
    process.exit(0);
  }

  await writeFile(enFile, enContent);
  await writeFile(esFile, esContent);

  process.stdout.write(`Created:\n- ${path.relative(projectRoot, enFile)}\n- ${path.relative(projectRoot, esFile)}\n`);
} finally {
  rl.close();
}

async function loadTemplate(fileName) {
  const templatePath = path.join(templateDir, fileName);
  return readFile(templatePath, 'utf8');
}

function renderTemplate(template, values) {
  let result = template
    .replaceAll('__LANG__', values.lang)
    .replaceAll('__SLUG__', values.slug)
    .replaceAll('__TITLE__', escapeYaml(values.title))
    .replaceAll('__DESCRIPTION__', escapeYaml(values.description))
    .replaceAll('__PUB_DATE__', values.pubDate)
    .replaceAll('__UPDATED_DATE__', values.updatedDate ?? values.pubDate)
    .replaceAll('__ASSET__', values.asset)
    .replaceAll('__HERO_CAPTION__', values.lang === 'en' ? 'Cover image generated with AI' : 'Imagen de portada creada con IA');

  if (!values.asset) {
    result = result
      .replace(/^heroImage:\s*'.*'\n?/m, '')
      .replace(/^heroImageCaption:\s*'.*'\n?/m, '');
  }

  return result;
}

async function ensureWritableTarget(filePath) {
  try {
    await access(filePath);
    throw new Error(`Refusing to overwrite existing file: ${path.relative(projectRoot, filePath)}`);
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }
}

function validateAnswers(answers, options = {}) {
  const { baseMode = false } = options;

  if (!answers.slug) {
    throw new Error('A base slug is required.');
  }

  if (!answers.titleEn || !answers.titleEs) {
    throw new Error('Both English and Spanish titles are required.');
  }

  if (!answers.descriptionEn || !answers.descriptionEs) {
    throw new Error('Both English and Spanish descriptions are required.');
  }

  if (!baseMode && !answers.asset) {
    throw new Error('An asset filename is required.');
  }
}

function titleFromSlug(slug) {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeSlug(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseArgs(args) {
  const result = {};

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (!current.startsWith('--')) continue;

    const [key, inlineValue] = current.slice(2).split('=');
    if (inlineValue !== undefined) {
      result[key] = inlineValue;
      continue;
    }

    const nextValue = args[index + 1];
    if (nextValue && !nextValue.startsWith('--')) {
      result[key] = nextValue;
      index += 1;
    } else {
      result[key] = true;
    }
  }

  return result;
}

async function ask(rlInterface, question) {
  const answer = await rlInterface.question(question);
  return answer.trim();
}

function escapeYaml(value) {
  return String(value).replaceAll("'", "''");
}
