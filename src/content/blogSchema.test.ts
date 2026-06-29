import { readFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { createBlogSchema } from './blogSchema';

const blogSchema = createBlogSchema({ image: () => z.any() });
const blogDirectory = new URL('./blog/', import.meta.url);

function parseScalar(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function readFrontmatter(filePath: string) {
  const content = readFileSync(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${filePath}`);
  }

  return match[1].split('\n').reduce<Record<string, string>>((accumulator, line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return accumulator;
    }

    const separatorIndex = trimmed.indexOf(':');

    if (separatorIndex === -1) {
      return accumulator;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    accumulator[key] = parseScalar(value);
    return accumulator;
  }, {});
}

describe('blog frontmatter schema', () => {
  it('validates the existing blog posts', () => {
    const files = readdirSync(blogDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => join(blogDirectory.pathname, entry.name));

    for (const filePath of files) {
      const frontmatter = readFrontmatter(filePath);
      expect(blogSchema.safeParse(frontmatter).success).toBe(true);
    }
  });

  it('rejects invalid slugs, languages, and dates', () => {
    const invalidSlug = blogSchema.safeParse({
      lang: 'en',
      postSlug: 'Invalid Slug',
      title: 'Example',
      description: 'Example',
      pubDate: '2026-06-29',
    });

    const invalidLang = blogSchema.safeParse({
      lang: 'pt',
      postSlug: 'valid-slug',
      title: 'Example',
      description: 'Example',
      pubDate: '2026-06-29',
    });

    const invalidDate = blogSchema.safeParse({
      lang: 'es',
      postSlug: 'valid-slug',
      title: 'Example',
      description: 'Example',
      pubDate: 'not-a-date',
      updatedDate: 'also-not-a-date',
    });

    expect(invalidSlug.success).toBe(false);
    expect(invalidLang.success).toBe(false);
    expect(invalidDate.success).toBe(false);
  });
});